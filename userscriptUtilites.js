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

function getUpdateURL(file) {
    const metablockMatcher = file.match(/(\/\/ ==UserScript==\n.*\/\/ ==\/UserScript==)/s);
    if (metablockMatcher == null || metablockMatcher[1] == null) {
        throw new Error("Could not locate the metadata block.");
    }

    const metablock = metablockMatcher[1];

    const updateURLMatcher = metablock.match(/\/\/ @updateURL\s+(\S+)\n/);
    if (updateURLMatcher == null || updateURLMatcher[1] == null) {
        throw new Error("Could not locate a updateURL in the metablock.");
    }

    const version = updateURLMatcher[1];
    return version;
}

export { getUpdateURL, getMetadataVersion };