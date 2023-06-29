import { RedditSession } from "./RedditSession";
import { Storage, STORAGE_KEY } from "../userscript/Storage";

interface RedditPost {
    container: HTMLElement,
    subreddit: string
}

class Reddit {
    private readonly document: Document;
    private readonly redditSession: RedditSession;
    private readonly storage: Storage;

    constructor(document: Document, redditSession: RedditSession) {
        this.document = document;
        this.redditSession = redditSession;
        this.storage = this.storageSupplier();
    }

    /**
     * Returns a post container that can be used for mutation monitoring.
     */
    getMainContentElement(): HTMLElement {
        const mainContentElement = this.document.getElementById("AppRouter-main-content");
        if (mainContentElement == null) {
            throw new Error("Could not find main content element.");
        }

        return mainContentElement;
    }

    /**
     * Get a list of muted posts on this page.
     */
    getMutedPosts(): Promise<RedditPost[]> {
        return this.redditSession.getMutedSubreddits()
            .catch((e) => {
                if (this.storage.get(STORAGE_KEY.DEBUG)) {
                    console.warn(e);
                }

                return [];
            })
            .then((mutedSubreddits: string[]) => {
                // Get the subreddit name (and subreddit image).
                return Array.from(this.document.querySelectorAll('a[data-click-id="subreddit"]') as NodeListOf<HTMLElementTagNameMap["a"]>)
                    .filter((element: HTMLAnchorElement) => element.innerText != null && element.innerText != "") // Filter out the subreddit images.
                    // Filter out elements that don't match the subreddits to remove.
                    .filter((element: HTMLAnchorElement) => {
                        const subredditName = element.innerText.substring(2);
                        for (const denySubredditName of mutedSubreddits) {
                            if (subredditName.toLowerCase() === denySubredditName.toLowerCase()) {
                                return true;
                            }
                        }

                        return false;
                    })
                    // Get the post elements.
                    .map((element: HTMLAnchorElement): RedditPost => {
                        /* eslint-disable max-len */
                        const container = element.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement;
                        return {
                            container: container != null ? container : element,
                            subreddit: element.innerText
                        };
                    });
            });
    }

    /* istanbul ignore next */
    protected storageSupplier(): Storage {
        return new Storage();
    }
}

export { Reddit, RedditPost };