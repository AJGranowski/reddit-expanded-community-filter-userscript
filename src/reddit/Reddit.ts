import { RedditSession } from "./RedditSession";

interface RedditPost {
    container: HTMLElement,
    subreddit: string
}

class Reddit {
    private readonly document: Document;
    private readonly redditSession: RedditSession;

    constructor(document: Document, redditSession: RedditSession) {
        this.document = document;
        this.redditSession = redditSession;
    }

    /**
     * Returns a post feed container that can be used for mutation monitoring.
     */
    getFeedContainer(): Element {
        const mainContentElement = this.document.getElementById("AppRouter-main-content");
        if (mainContentElement == null) {
            throw new Error("Could not find main content element.");
        }

        const ITERATION_LIMIT = 3;
        let feedContainer: Element | null | undefined = mainContentElement.querySelector(".Post")?.parentElement;
        let iterationCount = 0;
        while (iterationCount < ITERATION_LIMIT) {
            if (feedContainer == null) {
                return mainContentElement;
            }

            if (feedContainer.children.length >= 3) {
                break;
            }

            feedContainer = feedContainer.parentElement;
            iterationCount++;
        }

        if (iterationCount >= ITERATION_LIMIT) {
            throw new Error("Could not find feed container: Iteration limit exceeded.");
        }

        return feedContainer!;
    }

    /**
     * Get a list of muted posts on this page.
     */
    getMutedPosts(nodeList: Iterable<ParentNode> = [this.document]): Promise<Iterable<RedditPost>> {
        return this.redditSession.getMutedSubreddits()
            .then((mutedSubreddits: string[]) => {
                const lowerCaseMutedSubreddits = new Set(mutedSubreddits.map((x) => x.toLowerCase()));

                const visitedSubreddits: Set<string> = new Set();
                const result: RedditPost[] = [];
                for (const node of nodeList) {
                    this.getSubredditNameElements(node)
                        .filter((element: HTMLAnchorElement) => {
                            const subredditName = element.innerHTML.substring(2);
                            if (visitedSubreddits.has(subredditName)) {
                                return false;
                            }

                            visitedSubreddits.add(subredditName);
                            return lowerCaseMutedSubreddits.has(subredditName.toLowerCase());
                        })
                        .forEach((element: HTMLAnchorElement) => {
                            const container = this.getPostContainerFromSubredditName(element);
                            if (container == null) {
                                return;
                            }

                            result.push({
                                container: container,
                                subreddit: element.innerHTML
                            });
                        });
                }

                return result;
            });
    }

    /**
     * Returns the "/r/..." anchor element found on posts.
     */
    private getSubredditNameElements(rootNode: ParentNode): HTMLAnchorElement[] {
        return Array.from(rootNode.querySelectorAll('a[data-click-id="subreddit"]') as NodeListOf<HTMLElementTagNameMap["a"]>)
            // Filter out the subreddit images so only the subreddit name elements are left.
            .filter((element: HTMLAnchorElement) => element.firstChild != null && element.firstChild.nodeType === Node.TEXT_NODE);
    }

    /**
     * Returns the parent post container given a subreddit name anchor element.
     */
    private getPostContainerFromSubredditName(subredditNameElement: HTMLAnchorElement): HTMLElement | null | undefined {
        // Crawl up until we find the Post class, then go up two parents.
        const ITERATION_LIMIT = 8;
        let postContainer: Element = subredditNameElement;
        let iterationCount = 0;
        while (iterationCount < ITERATION_LIMIT) {
            if (postContainer.classList.contains("Post")) {
                break;
            }

            if (postContainer.parentElement == null) {
                throw new Error("Could not find post container: Dangling element.");
            }

            postContainer = postContainer.parentElement;
            iterationCount++;
        }

        if (iterationCount >= ITERATION_LIMIT) {
            throw new Error("Could not find post container: Iteration limit exceeded.");
        }

        return postContainer.parentElement?.parentElement;
    }
}

export { Reddit, RedditPost };