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
    getMutedPosts(nodeList: Iterable<ParentNode> = [this.document]): Promise<Iterable<RedditPost>> {
        return this.redditSession.getMutedSubreddits()
            .then((mutedSubreddits: string[]) => {
                const lowerCaseMutedSubreddits = new Set(mutedSubreddits.map((x) => x.toLowerCase()));

                const result: Set<RedditPost> = new Set();
                for (const node of nodeList) {
                    this.getSubredditNameElements(node)
                        .filter((element: HTMLAnchorElement) => {
                            const subredditName = element.innerText.substring(2);
                            return lowerCaseMutedSubreddits.has(subredditName.toLowerCase());
                        })
                        .forEach((element: HTMLAnchorElement) => {
                            const container = this.getPostContainerFromSubredditName(element);
                            result.add({
                                container: container != null ? container : element,
                                subreddit: element.innerText
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
            .filter((element: HTMLAnchorElement) => element.innerText != null && element.innerText != "");
    }

    /**
     * Returns the parent post container given a subreddit name anchor element.
     */
    private getPostContainerFromSubredditName(subredditNameElement: HTMLAnchorElement): HTMLElement | null | undefined {
        return subredditNameElement.parentElement
            ?.parentElement
            ?.parentElement
            ?.parentElement
            ?.parentElement
            ?.parentElement
            ?.parentElement
            ?.parentElement;
    }
}

export { Reddit, RedditPost };