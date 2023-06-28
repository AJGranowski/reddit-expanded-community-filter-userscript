import fs from "fs/promises";
import https from "https";
import process from "process";

import { getDownloadURL, getMetadataVersion } from "./userscriptUtilites.js";

if (process.argv.length < 4) {
    console.error("Expected: user script path, meta script path");
    process.exit(1);
}

const userScriptPath = process.argv[2];
const metaScriptPath = process.argv[3];

function versionCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true });
}

const userScriptPromise = fs.readFile(userScriptPath, {encoding: "utf8"});

const userScriptVersionPromise = userScriptPromise
    .then((file) => getMetadataVersion(file));

const metaScriptVersionPromise = fs.readFile(metaScriptPath, {encoding: "utf8"})
    .then((file) => getMetadataVersion(file));

const downloadURLPromise = userScriptPromise
    .then((file) => getDownloadURL(file));

await Promise.all([userScriptVersionPromise, metaScriptVersionPromise, downloadURLPromise])
    .then(([userScriptVersion, metaScriptVersion, downloadURL]) => {
        if (userScriptVersion !== metaScriptVersion) {
            throw new Error(`User script version (${userScriptVersion}) does not match the meta script version (${metaScriptVersion}).`);
        }

        return downloadURL;
    })
    .then((downloadURL) => {
        let toplevelError = false;
        return new Promise((resolve, reject) => {
            try {
                const request = https.get(downloadURL, (result) => {
                    if (result.statusCode !== 200) {
                        const error = new Error("Request Failed.\n" +
                            `Status Code: ${result.statusCode}\n` +
                            `URL: ${downloadURL}`);
                        result.resume();
                        reject(error);
                        return;
                    }
    
                    result.setEncoding("utf8");
                    let data = [];
                    result.on("data", (chunk) => {
                        data.push(chunk);
                    });
    
                    result.on("end", () => {
                        resolve(data.join(""));
                    });
                });
    
                request.setTimeout(8000, reject);
                request.on("error", reject);
            } catch (e) {
                toplevelError = true;
                throw e;
            }
        })
            .then((productionUserScript) => getMetadataVersion(productionUserScript))
            .catch((e) => {
                if (toplevelError) {
                    throw e;
                }

                console.warn(e);
                return null;
            });
    })
    .then(async (productionUserScriptVersion) => {
        // Always pass if there is no production script
        if (productionUserScriptVersion != null) {
            const userScriptVersion = await userScriptVersionPromise;
            if (versionCompare(userScriptVersion, productionUserScriptVersion) > 0) {
                throw new Error(`User script version (${userScriptVersion}) is less than or equal to the production version (${productionUserScriptVersion}).`);
            }
        }
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });