import { DebugMenu } from "./userscript/DebugMenu";
import { Localization } from "./i18n/Localization";
import { RedditExpandedCommunityFilter } from "./RedditExpandedCommunityFilter";
import { Storage, STORAGE_KEY } from "./userscript/Storage";
import { TotalMutedPostsCounter } from "./userscript/TotalMutedPostsCounter";

window.addEventListener("languagechange", () => {
    Localization.SINGLETON.setPreferredLanguages(navigator.languages);
});

const redditExpandedCommunityFilter = new RedditExpandedCommunityFilter();
const debugMenu = new DebugMenu((enableDebug) => {
    if (!enableDebug) {
        redditExpandedCommunityFilter.refresh();
    }
});

const storage = new Storage();
const totalMutedPostsCounter = new TotalMutedPostsCounter();

debugMenu.draw();
totalMutedPostsCounter.draw();
redditExpandedCommunityFilter.start()
    .then(() => {
        if (storage.get(STORAGE_KEY.DEBUG)) {
            console.log("Stopped script.");
        }
    })
    .catch((e) => {
        console.error(e);
    });