import { AsyncXMLHttpRequest } from "../userscript/AsyncXMLHttpRequest";
import { MutedSubredditsResponse } from "./@types/MutedSubredditsResponse";

/**
 * Specialized web request class.
 */
class Fetch {
    private readonly asyncXMLHttpRequest: AsyncXMLHttpRequest;
    private readonly domParser: DOMParser;

    constructor() {
        this.asyncXMLHttpRequest = this.asyncXMLHttpRequestSupplier();
        this.domParser = this.domParserSupplier();
    }

    /**
     * Request an HTML document.
     */
    fetchDocument(url: string): Promise<Document> {
        const request: Tampermonkey.Request = {
            method: "GET",
            url: url
        };

        return this.asyncXMLHttpRequest.asyncXMLHttpRequest(request, (response) => response.status >= 200 && response.status < 300)
            .then((response) => {
                return this.domParser.parseFromString(response.responseText, "text/html");
            });
    }

    /**
     * Request the list of muted subreddits for this account.
     * The access token can be retrieved by plugging various sources into the AccessToken class.
     */
    fetchMutedSubreddits(accessToken: string): Promise<string[]> {
        const request: Tampermonkey.Request = {
            data: JSON.stringify({
                "id": "c09ff0d041c1" // Muted subreddits ID.
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            method: "POST",
            url: "https://gql.reddit.com/"
        };

        return this.asyncXMLHttpRequest.asyncXMLHttpRequest(request, (response) => response.status >= 200 && response.status < 300)
            .then((response) => {
                const responseJSON = JSON.parse(response.responseText) as MutedSubredditsResponse;
                if (responseJSON.data.identity == null) {
                    throw new Error("User is logged out.");
                }

                return responseJSON.data.identity.mutedSubreddits.edges
                    .map((x) => x.node.name);
            });
    }

    /* istanbul ignore next */
    protected asyncXMLHttpRequestSupplier(): AsyncXMLHttpRequest {
        return new AsyncXMLHttpRequest();
    }

    /* istanbul ignore next */
    protected domParserSupplier(): DOMParser {
        return new DOMParser();
    }
}

export { Fetch };