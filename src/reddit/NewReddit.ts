import { RedditFeed } from "./@types/RedditFeed";
import { RedditPostItem } from "./@types/RedditPostItem";
import { RedditSession } from "./RedditSession";

class NewReddit implements RedditFeed {
    private readonly document: Document;
    private readonly redditSession: RedditSession;

    constructor(document: Document, redditSession: RedditSession) {
        if (document.body.className !== "") {
            throw new Error("Document is not using the new Reddit layout.");
        }

        this.document = document;
        this.redditSession = redditSession;
    }

    getFeedContainer(): Element {
        const mainContentElement = this.document.getElementById("AppRouter-main-content");
        if (mainContentElement == null) {
            throw new Error("Could not find main content element.");
        }

        const ITERATION_LIMIT = 5;
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
            console.warn(new Error("Could not find feed container: Iteration limit exceeded. Defaulting to main content element."));
            return mainContentElement;
        }

        return feedContainer!;
    }

    getMutedPosts(nodeList: Iterable<ParentNode> = [this.document]): Promise<Iterable<RedditPostItem>> {
        return this.redditSession.getMutedSubreddits()
            .then((mutedSubreddits: string[]) => {
                const lowerCaseMutedSubreddits = new Set(mutedSubreddits.map((x) => x.toLowerCase()));

                const result: RedditPostItem[] = [];
                for (const node of nodeList) {
                    this.getSubredditNameElements(node)
                        .filter((element: HTMLAnchorElement) => {
                            const subredditName = element.innerHTML.substring(2);
                            return lowerCaseMutedSubreddits.has(subredditName.toLowerCase());
                        })
                        .forEach((element: HTMLAnchorElement) => {
                            const container = this.getPostContainerFromSubredditName(element);
                            if (container == null) {
                                return;
                            }

                            result.push({
                                elements: [container],
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

export { NewReddit };