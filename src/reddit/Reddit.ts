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
    getMutedPosts(): Promise<RedditPost[]> {
        return this.redditSession.getMutedSubreddits()
            .then((mutedSubreddits: string[]) => {
                const lowerCaseMutedSubreddits = new Set(mutedSubreddits.map((x) => x.toLowerCase()));

                return this.getSubredditNameElements()
                    .filter((element: HTMLAnchorElement) => {
                        const subredditName = element.innerText.substring(2);
                        return lowerCaseMutedSubreddits.has(subredditName.toLowerCase());
                    })
                    .map((element: HTMLAnchorElement): RedditPost => {
                        const container = this.getPostContainerFromSubredditName(element);
                        return {
                            container: container != null ? container : element,
                            subreddit: element.innerText
                        };
                    });
            });
    }

    /**
     * Returns the "/r/..." anchor element found on posts.
     */
    private getSubredditNameElements(): HTMLAnchorElement[] {
        return Array.from(this.document.querySelectorAll('a[data-click-id="subreddit"]') as NodeListOf<HTMLElementTagNameMap["a"]>)
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