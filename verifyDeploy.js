import fs from "fs/promises";
import https from "https";
import process from "process";

import { getUpdateURL, getMetadataVersion } from "./userscriptUtilites.js";

if (process.argv.length < 4) {
    console.error("Expected: user script path, meta script path");
    process.exit(1);
}

const userScriptPath = process.argv[2];
const metaScriptPath = process.argv[3];

function versionCompare(a, b) {
    return a.localeCompare(b, undefined, { numeric: true });
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        try {
            const request = https.get(url, (response) => {
                if (response.statusCode === 302) {
                    fetch(response.headers.location)
                        .then(resolve)
                        .catch(reject);
                    response.destroy();
                    return;
                }

                if (response.statusCode !== 200) {
                    const error = new Error("Request Failed.\n" +
                        `Status Code: ${response.statusCode}\n` +
                        `URL: ${url}`);
                    response.destroy();
                    reject(error);
                    return;
                }

                response.setEncoding("utf8");
                let data = [];
                response.on("data", (chunk) => {
                    data.push(chunk);
                });

                response.on("end", () => {
                    response.destroy();
                    resolve(data.join(""));
                });
            });

            request.setTimeout(8000, reject);
            request.on("error", reject);
        } catch (e) {
            e.fatal = true;
            reject(e);
        }
    });
}

const userScriptPromise = fs.readFile(userScriptPath, {encoding: "utf8"});

const userScriptVersionPromise = userScriptPromise
    .then((file) => getMetadataVersion(file));

const metaScriptVersionPromise = fs.readFile(metaScriptPath, {encoding: "utf8"})
    .then((file) => getMetadataVersion(file));

const getUpdateURLPromise = userScriptPromise
    .then((file) => getUpdateURL(file));

await Promise.all([userScriptVersionPromise, metaScriptVersionPromise, getUpdateURLPromise])
    .then(([userScriptVersion, metaScriptVersion, getUpdateURL]) => {
        if (userScriptVersion !== metaScriptVersion) {
            throw new Error(`User script version (${userScriptVersion}) does not match the meta script version (${metaScriptVersion}).`);
        }

        return getUpdateURL;
    })
    .then((getUpdateURL) => {
        return fetch(getUpdateURL)
            .then((productionUserScript) => getMetadataVersion(productionUserScript))
            .catch((e) => {
                if (e != null && e.fatal === true) {
                    throw e;
                }

                console.warn(e);
                return null;
            });
    })
    .then(async (productionmetaScriptVersion) => {
        // Always pass if there is no production script
        if (productionmetaScriptVersion != null) {
            const userScriptVersion = await userScriptVersionPromise;
            if (versionCompare(userScriptVersion, productionmetaScriptVersion) > 0) {
                throw new Error(`User script version (${userScriptVersion}) is less than or equal to the production version (${productionmetaScriptVersion}).`);
            }
        }
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });