import { RedditFeed } from "./@types/RedditFeed";
import { RedditPostItem } from "./@types/RedditPostItem";
import { RedditSession } from "./RedditSession";

class Shreddit implements RedditFeed {
    private readonly document: Document;
    private readonly redditSession: RedditSession;

    constructor(document: Document, redditSession: RedditSession) {
        if (document.body.className !== "v2") {
            throw new Error("Document is not using the Shreddit layout.");
        }

        this.document = document;
        this.redditSession = redditSession;
    }

    getFeedContainer(): Element {
        const shredditFeedElements = this.document.getElementsByTagName("shreddit-feed");
        if (shredditFeedElements.length < 1) {
            throw new Error("Could not find shreddit-feed element.");
        } else if (shredditFeedElements.length > 1) {
            throw new Error("More than one shreddit-feed element.");
        }

        const shredditFeedElement = shredditFeedElements.item(0);
        if (shredditFeedElement == null) {
            throw new Error("shreddit-feed element is null.");
        }

        return shredditFeedElement;
    }

    getMutedPosts(nodeList: Iterable<ParentNode> = [this.document]): Promise<Iterable<RedditPostItem>> {
        return this.redditSession.getMutedSubreddits()
            .then((mutedSubreddits: string[]) => {
                const lowerCaseMutedSubreddits = new Set(mutedSubreddits.map((x) => x.toLowerCase()));

                const result: RedditPostItem[] = [];
                for (const node of nodeList) {
                    this.getPosts(node)
                        .filter((element: HTMLElement) => {
                            const subredditName = element.getAttribute("subreddit-prefixed-name")!.substring(2);
                            return lowerCaseMutedSubreddits.has(subredditName.toLowerCase());
                        })
                        .forEach((element: HTMLElement) => {
                            const postContainer = element.parentElement!;

                            result.push({
                                container: postContainer,
                                subreddit: element.getAttribute("subreddit-prefixed-name")!
                            });

                            result.push({
                                container: postContainer.nextElementSibling! as HTMLElement,
                                subreddit: element.getAttribute("subreddit-prefixed-name")!
                            });
                        });
                }

                return result;
            });
    }

    /**
     * Returns shreddit posts.
     */
    private getPosts(rootNode: ParentNode): HTMLElement[] {
        return Array.from(rootNode.querySelectorAll("shreddit-post") as NodeListOf<HTMLElement>)
            .filter((element: HTMLElement) => element.parentElement != null && element.hasAttribute("subreddit-prefixed-name"));
    }
}

export { Shreddit };