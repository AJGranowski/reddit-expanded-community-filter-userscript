import { DebugMenu } from "./userscript/DebugMenu";
import { RedditExpandedCommunityFilter } from "./RedditExpandedCommunityFilter";
import { Storage, STORAGE_KEY } from "./userscript/Storage";

const debugMenu = new DebugMenu();
const redditExpandedCommunityFilter = new RedditExpandedCommunityFilter();
const storage = new Storage();

debugMenu.draw();
redditExpandedCommunityFilter.start()
    .then(() => {
        if (storage.get(STORAGE_KEY.DEBUG)) {
            console.log("Stopped script.");
        }
    })
    .catch((e) => {
        console.error(e);
    })
    .finally(() => {
        debugMenu.erase();
    });