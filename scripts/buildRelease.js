import fs from "fs/promises";
import path from "path";
import process from "process";

import pkg from "../package.json" assert { type: "json" };
import { getMetadataVersion } from "./userscriptUtilites.js";

const config = pkg.config;

if (process.argv.length < 4) {
    console.error("Expected: bundle path, output directory");
    process.exit(1);
}

function makeMetaScript(version) {
    return "// ==UserScript==\n" +
        `// @version ${version}\n` +
        "// ==/UserScript==";
}

const bundlePath = process.argv[2];
const outputDirectory = process.argv[3];

const bundleFileContentsPromise = fs.readFile(bundlePath, {encoding: "utf8"});
const makeOutputDirectoryPromise = fs.mkdir(outputDirectory, {recursive: true});

await Promise.all([bundleFileContentsPromise, makeOutputDirectoryPromise])
    .then(([bundleFileContents]) => {
        const copyBundlePromise = fs.writeFile(path.join(outputDirectory, config.releaseScriptUser), bundleFileContents, {encoding: "utf8"});

        const metaScriptContents = makeMetaScript(getMetadataVersion(bundleFileContents));
        const makeMetaScriptPromise = fs.writeFile(path.join(outputDirectory, config.releaseScriptMeta), metaScriptContents, {encoding: "utf8"});

        return Promise.all([copyBundlePromise, makeMetaScriptPromise]);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });