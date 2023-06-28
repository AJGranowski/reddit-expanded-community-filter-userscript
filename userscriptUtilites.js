import fs from "fs/promises";

function getMetadataVersion(file) {
    const metablockMatcher = file.match(/(\/\/ ==UserScript==\n.*\/\/ ==\/UserScript==)/s);
    if (metablockMatcher == null || metablockMatcher[1] == null) {
        throw new Error("Could not locate the metadata block.");
    }

    const metablock = metablockMatcher[1];

    const versionMatcher = metablock.match(/\/\/ @version\s+(\S+)\n/);
    if (versionMatcher == null || versionMatcher[1] == null) {
        throw new Error("Could not locate a version in the metablock.");
    }

    const version = versionMatcher[1];
    return version;
}

function getDownloadURL(file) {
    const metablockMatcher = file.match(/(\/\/ ==UserScript==\n.*\/\/ ==\/UserScript==)/s);
    if (metablockMatcher == null || metablockMatcher[1] == null) {
        throw new Error("Could not locate the metadata block.");
    }

    const metablock = metablockMatcher[1];

    const downloadURLMatcher = metablock.match(/\/\/ @downloadURL\s+(\S+)\n/);
    if (downloadURLMatcher == null || downloadURLMatcher[1] == null) {
        throw new Error("Could not locate a downloadURL in the metablock.");
    }

    const version = downloadURLMatcher[1];
    return version;
}

export { getDownloadURL, getMetadataVersion };