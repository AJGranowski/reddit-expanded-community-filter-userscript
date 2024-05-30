function getMetaBlock(file) {
    const metablockMatcher = file.match(/(\/\/ ==UserScript==\n.*\/\/ ==\/UserScript==)/s);
    if (metablockMatcher == null || metablockMatcher[1] == null) {
        throw new Error("Could not locate the metadata block.");
    }

    return metablockMatcher[1];
}

function getMetadataVersion(file) {
    const metablock = getMetaBlock(file);
    const versionMatcher = metablock.match(/\/\/ @version\s+(\S+)\n/);
    if (versionMatcher == null || versionMatcher[1] == null) {
        throw new Error("Could not locate a version in the metablock.");
    }

    return versionMatcher[1];
}

function getUpdateURL(file) {
    const metablock = getMetaBlock(file);
    const updateURLMatcher = metablock.match(/\/\/ @updateURL\s+(\S+)\n/);
    if (updateURLMatcher == null || updateURLMatcher[1] == null) {
        throw new Error("Could not locate a updateURL in the metablock.");
    }

    return updateURLMatcher[1];
}

export { getUpdateURL, getMetadataVersion };