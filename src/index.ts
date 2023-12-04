import { DebugMenu } from "./userscript/DebugMenu";
import { RedditExpandedCommunityFilter } from "./RedditExpandedCommunityFilter";
import { Storage, STORAGE_KEY } from "./userscript/Storage";
import { TotalMutedPostsCounter } from "./userscript/TotalMutedPostsCounter";

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