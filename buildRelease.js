import fs from "fs/promises";
import path from "path";
import process from "process";

import pkg from "./package.json" assert { type: "json" };
import { getMetadataVersion } from "./userscriptUtilites.js";

const config = pkg.config;

if (process.argv.length < 4) {
    console.error("Expected: bundle path, output directory");
    process.exit(1);
}

const bundlePath = process.argv[2];
const outputDirectory = process.argv[3];

const metaScriptContents = fs.readFile(bundlePath, {encoding: "utf8"})
    .then((file) => getMetadataVersion(file))
    .then((version) => {
        return "// ==UserScript==\n" +
            `// @version ${version}\n` +
            "// ==/UserScript==";
    });

await fs.mkdir(outputDirectory, {recursive: true})
    .then(() => {
        const copyBundle = fs.copyFile(bundlePath, path.join(outputDirectory, config.releaseScriptUser));
        const makeMetaScript = metaScriptContents
            .then((metaScriptContents) => {
                return fs.writeFile(path.join(outputDirectory, config.releaseScriptMeta), metaScriptContents, {encoding: "utf8"});
            });

        return Promise.all([copyBundle, makeMetaScript]);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });