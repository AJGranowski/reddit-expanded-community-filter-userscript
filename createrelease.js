import fs from "fs/promises";
import path from "path";
import process from "process";

if (process.argv.length < 4) {
    console.error("Expected: bundle path, output directory");
    process.exit(1);
}

const bundlePath = process.argv[2];
const outputDirectory = process.argv[3];

const metaScriptContents = fs.readFile(bundlePath, {encoding: "utf8"})
    .then((file) => {
        const metablockMatcher = file.match(/(\/\/ ==UserScript==\n.*\/\/ ==\/UserScript==)/s);
        if (metablockMatcher == null || metablockMatcher[1] == null) {
            throw new Error(`Could not locate the metadata block of ${bundlePath}`);
        }

        return metablockMatcher[1];
    })
    .then((metablock) => {
        const versionMatcher = metablock.match(/\/\/ @version\s+(\S+)\n/);
        if (versionMatcher == null || versionMatcher[1] == null) {
            throw new Error(`Could not locate a version in the metablock of ${bundlePath}`);
        }

        return versionMatcher[1];
    })
    .then((version) => {
        return "// ==UserScript==\n" +
        `// @version ${version}\n` + 
        "// ==/UserScript==";
    });

await fs.mkdir(outputDirectory, {recursive: true})
    .then(() => {
        const copyBundle = fs.copyFile(bundlePath, path.join(outputDirectory, "script.user.js"));
        const makeMetaScript = metaScriptContents
            .then((metaScriptContents) => {
                return fs.writeFile(path.join(outputDirectory, "script.meta.js"), metaScriptContents, {encoding: "utf8"});
            });

        return Promise.all([copyBundle, makeMetaScript]);
    });