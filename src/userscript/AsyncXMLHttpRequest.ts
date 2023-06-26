/**
 * Makes a simple XML request and returns a promise of the onload response.
 * Will reject the result of onload if onLoadPredicate returns false (if the status code is 4xx for example).
 */
class AsyncXMLHttpRequest {
    public asyncXMLHttpRequest<T>(details: Tampermonkey.Request<T>, onLoadPredicate: (response: Tampermonkey.Response<T>) => boolean): Promise<Tampermonkey.Response<T>> {
        return new Promise((resolve, reject) => {
            this.xmlHttpRequest({
                timeout: 20000,
                ...details,
                onabort: () => {
                    reject(new Error("Request aborted."));
                },
                onerror: (response: Tampermonkey.ErrorResponse) => {
                    reject(response);
                },
                onload: (response: Tampermonkey.Response<T>) => {
                    if (onLoadPredicate(response)) {
                        resolve(response);
                    } else {
                        reject(response);
                    }
                },
                ontimeout: () => {
                    reject(new Error("Request timed out."));
                }
            });
        });
    }

    /* istanbul ignore next */ 
    protected xmlHttpRequest<T>(details: Tampermonkey.Request<T>): Tampermonkey.AbortHandle<void> {
        return GM_xmlhttpRequest(details);
    }
}

export { AsyncXMLHttpRequest };