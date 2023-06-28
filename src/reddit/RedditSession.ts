import { AccessToken } from "./AccessToken";
import { Fetch } from "../web/Fetch";
import { promisify } from "../utilities/promisify";
import { Storage, STORAGE_KEY } from "../userscript/Storage";

interface SessionData {
    accessToken?: string;
    mutedSubreddits?: string[];
}

class RedditSession {
    private readonly fetch: Fetch;
    private readonly accessToken: AccessToken;
    private readonly sessionData: SessionData;
    private readonly storage: Storage;

    private updateAccessTokenPromise: Promise<string> | null;
    private updateMutedSubredditsPromise: Promise<string[]> | null;

    constructor(accessToken: AccessToken, fetch: Fetch) {
        this.accessToken = accessToken;
        this.fetch = fetch;
        this.sessionData = {};
        this.storage = this.storageSupplier();

        this.updateAccessTokenPromise = null;
        this.updateMutedSubredditsPromise = null;
    }

    /**
     * Get the stored access token, or request one.
     */
    getAccessToken(): Promise<string> {
        if (this.sessionData.accessToken == null) {
            return this.updateAccessToken();
        }

        return Promise.resolve(this.sessionData.accessToken);
    }

    /**
     * Get the stored muted subreddits, or request them.
     */
    getMutedSubreddits(): Promise<string[]> {
        if (this.sessionData.mutedSubreddits == null) {
            return this.updateMutedSubreddits();
        }

        return Promise.resolve(this.sessionData.mutedSubreddits);
    }

    /**
     * Try to get the access token using a failover chain.
     */
    updateAccessToken(): Promise<string> {
        if (this.updateAccessTokenPromise != null) {
            return this.updateAccessTokenPromise;
        }

        const fromWindow = promisify(() => this.accessToken.fromWindow(this.windowSupplier()));
        this.updateAccessTokenPromise = fromWindow()
            .catch((e) => {
                if (this.storage.get(STORAGE_KEY.DEBUG)) {
                    console.warn(e);
                    console.warn("Failing back to scraping.");
                }

                return this.fetch.fetchDocument("/coins")
                    .then((document: Document) => this.accessToken.fromDocument(document));
            })
            .then((accessToken: string) => {
                this.sessionData.accessToken = accessToken;
                return accessToken;
            })
            .finally(() => {
                this.updateAccessTokenPromise = null;
            });
        
        return this.updateAccessTokenPromise;
    }

    /**
     * Try to get the list of muted subreddits.
     * Will automatically request an access token if need be.
     */
    updateMutedSubreddits(): Promise<string[]> {
        if (this.updateMutedSubredditsPromise != null) {
            return this.updateMutedSubredditsPromise;
        }

        this.updateMutedSubredditsPromise = this.getAccessToken()
            .then((accessToken) => {
                return this.fetch.fetchMutedSubreddits(accessToken);
            })
            .then((mutedSubreddits) => {
                this.sessionData.mutedSubreddits = mutedSubreddits;
                return mutedSubreddits;
            })
            .finally(() => {
                this.updateMutedSubredditsPromise = null;
            });

        return this.updateMutedSubredditsPromise;
    }

    /* istanbul ignore next */ 
    protected storageSupplier(): Storage {
        return new Storage();
    }

    /* istanbul ignore next */ 
    protected windowSupplier(): Window {
        return unsafeWindow;
    }
}

export { RedditSession };