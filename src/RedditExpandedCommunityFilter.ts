import { AccessToken } from "./reddit/AccessToken";
import { AsyncMutationObserver } from "./utilities/AsyncMutationObserver";
import { Fetch } from "./web/Fetch";
import { Reddit, RedditPost } from "./reddit/Reddit";
import { Storage, STORAGE_KEY } from "./userscript/Storage";
import { RedditSession } from "./reddit/RedditSession";

const DEBUG_CLASSNAME = "muted-subreddit-post";

/**
 * Top level application for Reddit Expanded Community Filter.
 * Just call start() and wait.
 */
class RedditExpandedCommunityFilter {
    private readonly reddit: Reddit;
    private readonly redditSession: RedditSession;
    private readonly storage: Storage;

    private asyncMutationObserver: AsyncMutationObserver | null;
    private startObservingPromise: Promise<void> | null;
    private startPromise: Promise<void> | null;
    private styleElement: HTMLStyleElement | null;

    constructor() {
        this.redditSession = this.redditSessionSupplier();
        this.reddit = this.redditSupplier(this.redditSession);
        this.storage = this.storageSupplier();

        this.asyncMutationObserver = null;
        this.startObservingPromise = null;
        this.startPromise = null;
        this.styleElement = null;
    }

    start(): Promise<void> {
        if (this.startPromise != null) {
            return this.startPromise;
        }

        if (this.styleElement != null) {
            this.styleElement.remove();
            this.styleElement = null;
        }

        this.styleElement = this.addStyle(`.${DEBUG_CLASSNAME} {border: dashed red;}`);

        if (this.asyncMutationObserver != null) {
            this.asyncMutationObserver.disconnect();
            this.asyncMutationObserver = null;
        }

        let resolveStartObservingPromise: true | (() => void) | null = null;
        this.startObservingPromise = new Promise<void>((resolve) => {
            if (resolveStartObservingPromise == null) {
                resolveStartObservingPromise = resolve;
            } else {
                resolve();
            }
        });

        this.startPromise = Promise.all([this.redditSession.updateAccessToken(), this.redditSession.updateMutedSubreddits()])
            .then(() => {
                if (this.storage.get(STORAGE_KEY.DEBUG)) {
                    this.redditSession.getMutedSubreddits()
                        .then((mutedSubreddits: string[]) => {
                            console.log("Muted subreddits:", mutedSubreddits);
                        });
                }

                return this.reddit.getMainContentElement();
            })
            .then((mainContentElement: HTMLElement) => {
                this.asyncMutationObserver = this.asyncMutationObserverSupplier(() => {
                    this.reddit.getMutedPosts()
                        .then((redditPosts: RedditPost[]) => {
                            redditPosts.forEach((redditPost: RedditPost) => {
                                if (this.storage.get(STORAGE_KEY.DEBUG)) {
                                    if (!redditPost.container.classList.contains(DEBUG_CLASSNAME)) {
                                        redditPost.container.classList.add(DEBUG_CLASSNAME);
                                        console.log(`Highlighted ${redditPost.subreddit} post (muted subreddit).`);
                                    }
                                } else {
                                    redditPost.container.remove();
                                }
                            });
                        });
                });

                const observePromise = this.asyncMutationObserver.observe(mainContentElement, { attributes: false, childList: true, subtree: true });

                if (resolveStartObservingPromise != null && resolveStartObservingPromise !== true) {
                    resolveStartObservingPromise();
                } else {
                    resolveStartObservingPromise = true;
                }

                return observePromise;
            })
            .finally(() => {
                this.startPromise = null;
                if (this.styleElement != null) {
                    this.styleElement.remove();
                }
            });

        return this.startPromise;
    }

    stop(): Promise<void> {
        if (this.startObservingPromise == null) {
            return Promise.resolve();
        }

        return this.startObservingPromise
            .then(() => {
                if (this.startPromise == null) {
                    return;
                }

                if (this.asyncMutationObserver != null) {
                    this.asyncMutationObserver.disconnect();
                }

                return this.startPromise;
            });
    }

    /* istanbul ignore next */
    protected addStyle(css: string): HTMLStyleElement {
        return GM_addStyle(css);
    }

    /* istanbul ignore next */
    protected asyncMutationObserverSupplier(callback: MutationCallback): AsyncMutationObserver {
        return new AsyncMutationObserver(callback);
    }

    /* istanbul ignore next */
    protected redditSupplier(redditSession: RedditSession): Reddit {
        return new Reddit(document, redditSession);
    }

    /* istanbul ignore next */
    protected redditSessionSupplier(): RedditSession {
        return new RedditSession(new AccessToken(), new Fetch());
    }

    /* istanbul ignore next */
    protected storageSupplier(): Storage {
        return new Storage();
    }
}

export { RedditExpandedCommunityFilter };