import { ___rJSON } from "../web/@types/___rJSON";

class AccessToken {
    /**
     * Extract the access token from an OAuth token_v2
     */
    fromTokenV2(token_v2: string): string {
        /*
        * token_v2 is comprised of three elements.
        * The first two are base64 encoded JSON, and the second one contains the access token under the "sub" key.
        */
        return JSON.parse(atob(token_v2.split(".")[1])).sub;
    }

    /**
     * Attempt to get an access token from the ___r JSON object.
     */
    from___r(___rJSON: ___rJSON): string {
        return ___rJSON.user.session.accessToken;
    }

    /**
     * Attempt to get an access token from a Window.
     */
    fromWindow(window: Window): string {
        if ((window as any)["___r"] == null) {
            throw new Error("Unable to retrieve ___r JSON from window.");
        }

        return this.from___r((window as any)["___r"]);
    }

    /**
     * Attempt to get an access token from a Document.
     */
    fromDocument(document: Document): string {
        const dataElement = document.getElementById("data");
        if (dataElement == null) {
            throw new Error("Unable to retrieve ___r JSON from document: Could not find 'data' element.");
        }

        const jsonExtractMatcher = dataElement.innerHTML.match(/({.*});$/);
        if (jsonExtractMatcher == null || jsonExtractMatcher[1] == null) {
            throw new Error("Unable to retrieve ___r JSON from document: Unable to extract text.");
        }

        return this.from___r(JSON.parse(jsonExtractMatcher[1]));
    }
}

export { AccessToken };