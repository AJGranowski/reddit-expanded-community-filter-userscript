import { RedditPostItem } from "./RedditPostItem";

interface RedditFeed {
    /**
     * Returns a post feed container that can be used for mutation monitoring.
     */
    getFeedContainer(): Element

    /**
     * Get a list of muted posts on this page.
     */
    getMutedPosts(nodeList?: Iterable<ParentNode>): Promise<Iterable<RedditPostItem>>
}

export { RedditFeed };