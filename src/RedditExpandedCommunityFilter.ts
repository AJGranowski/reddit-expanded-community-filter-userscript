import { AccessToken } from "./reddit/AccessToken";
import { AsyncMutationObserver } from "./utilities/AsyncMutationObserver";
import { Fetch } from "./web/Fetch";
import { RedditFeed } from "./reddit/@types/RedditFeed";
import { RedditFeedFactory } from "./reddit/RedditFeedFactory";
import { RedditPostItem } from "./reddit/@types/RedditPostItem";
import { RedditSession } from "./reddit/RedditSession";
import { Storage, STORAGE_KEY } from "./userscript/Storage";

const DEBUG_CLASSNAME = "muted-subreddit-post";

/**
 * Top level application for Reddit Expanded Community Filter.
 * Just call start() and wait.
 */
class RedditExpandedCommunityFilter {
    private readonly asyncMutationObserver: AsyncMutationObserver;
    private readonly reddit: RedditFeed;
    private readonly redditSession: RedditSession;
    private readonly storage: Storage;

    private startObservingPromise: Promise<void> | null;
    private startPromise: Promise<void> | null;
    private styleElement: HTMLStyleElement | null;

    constructor() {
        this.asyncMutationObserver = this.asyncMutationObserverSupplier(this.mutationCallback);
        this.redditSession = this.redditSessionSupplier();
        this.reddit = this.redditSupplier(this.redditSession);
        this.storage = this.storageSupplier();

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

        this.asyncMutationObserver.disconnect();
        this.styleElement = this.addStyle(`.${DEBUG_CLASSNAME} {border: dashed red;}`);

        let resolveStartObservingPromise: true | (() => void) | null = null;
        this.startObservingPromise = new Promise<void>((resolve) => {
            if (resolveStartObservingPromise == null) {
                resolveStartObservingPromise = resolve;
            } else {
                resolve();
            }
        });

        const startObserving = (): Promise<any> => {
            return Promise.resolve()
                .then(this.debugPrintCallback)
                .then(() => this.refresh())
                .then(() => {
                    const feedContainerElement = this.reddit.getFeedContainer();
                    if (this.storage.get(STORAGE_KEY.DEBUG)) {
                        console.log("Feed container", feedContainerElement);
                    }

                    const options = { attributes: false, childList: true, subtree: true };
                    const observePromise = this.asyncMutationObserver.observe(feedContainerElement, options);
                    if (resolveStartObservingPromise != null && resolveStartObservingPromise !== true) {
                        resolveStartObservingPromise();
                    } else {
                        resolveStartObservingPromise = true;
                    }

                    return observePromise;
                });
        };

        this.startPromise = Promise.all([this.redditSession.updateAccessToken(), this.redditSession.updateMutedSubreddits()])
            .then(() => startObserving)
            .catch((e) => {
                if (this.storage.get(STORAGE_KEY.DEBUG)) {
                    console.warn(e);
                } else if (e instanceof Error) {
                    console.log(`${e.name}:`, e.message);
                } else {
                    console.warn(e);
                }

                return;
            })
            .then((func: void | (() => any)) => {
                if (func != null) {
                    return func();
                }
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

                this.asyncMutationObserver.disconnect();
                return this.startPromise;
            });
    }

    /**
     * Manually trigger an update.
     */
    refresh(): Promise<void> {
        return this.reddit.getMutedPosts()
            .then((redditPosts: Iterable<RedditPostItem>) => {
                for (const redditPost of redditPosts) {
                    this.mutePost(redditPost);
                }
            });
    }

    /**
     * Determine if this node contains text.
     *
     * `<a></a>` === `false`, `<a>text</a>` === `true`
     */
    private containsText(node: Node): boolean {
        return node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;
    }

    /**
     * Print the muted subreddits if debug mode is enabled.
     */
    private readonly debugPrintCallback: () => void | Promise<void> = () => {
        if (this.storage.get(STORAGE_KEY.DEBUG)) {
            return this.redditSession.getMutedSubreddits()
                .then((mutedSubreddits: string[]) => {
                    console.log("Muted subreddits:", mutedSubreddits);
                });
        }

        return;
    };

    /**
     * Mutation observer callback after filtering. Properties of these nodes include:
     * 1. Has a parent.
     * 2. Is not a text element.
     * 3. Is visible.
     */
    private filteredMutationCallback(addedNodes: ParentNode[]): Promise<any> {
        if (addedNodes.length === 0) {
            return Promise.resolve();
        }

        if (this.storage.get(STORAGE_KEY.DEBUG)) {
            console.debug("Added nodes:", addedNodes);
        }

        return this.reddit.getMutedPosts(addedNodes)
            .then((redditPosts: Iterable<RedditPostItem>) => {
                for (const redditPost of redditPosts) {
                    this.mutePost(redditPost);
                }
            });
    }

    /**
     * Duck typing HTMLElement objects from Node objects.
     */
    private isHTMLElement(node: Node): boolean {
        return "offsetHeight" in node &&
            "offsetLeft" in node &&
            "offsetTop" in node &&
            "offsetWidth" in node &&
            "querySelectorAll" in node;
    }

    private isVisible(element: HTMLElement): boolean {
        if ("checkVisibility" in element) {
            return element.checkVisibility();
        }

        return true;
    }

    private readonly mutationCallback: MutationCallback = (mutations: MutationRecord[]) => {
        // Filter mutations to look for added elements
        mutations = mutations.filter((mutation) => {
            return mutation.type === "childList" && mutation.addedNodes.length > 0;
        });

        // Filter and flatten added elements
        const addedNodes: ParentNode[] = [];
        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                const hasParent = addedNode.parentElement != null && addedNode.parentNode != null;
                if (!hasParent || !this.isHTMLElement(addedNode) || this.containsText(addedNode)) {
                    continue;
                }

                const addedElement = addedNode as HTMLElement;

                if (this.isVisible(addedElement)) {
                    addedNodes.push(addedElement);
                }
            }
        }

        return this.filteredMutationCallback(addedNodes);
    };

    private mutePost(redditPost: RedditPostItem): void {
        let postHighlighted: boolean = false;
        let postRemoved: boolean = false;
        for (const element of redditPost.elements) {
            if (this.storage.get(STORAGE_KEY.DEBUG)) {
                if (!element.classList.contains(DEBUG_CLASSNAME)) {
                    element.classList.add(DEBUG_CLASSNAME);
                    postHighlighted = true;
                }
            } else {
                element.remove();
                postRemoved = true;
            }
        }

        if (postHighlighted && this.storage.get(STORAGE_KEY.DEBUG)) {
            console.log(`Highlighted ${redditPost.subreddit} post (muted subreddit):`, redditPost.elements);
        }

        if (postRemoved) {
            const newTotalMutedPosts = Math.max(0, this.storage.get(STORAGE_KEY.TOTAL_MUTED_POSTS)) + 1;
            this.storage.set(STORAGE_KEY.TOTAL_MUTED_POSTS, newTotalMutedPosts);
        }
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
    protected redditSupplier(redditSession: RedditSession): RedditFeed {
        return (new RedditFeedFactory(redditSession)).getRedditFeed(document);
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