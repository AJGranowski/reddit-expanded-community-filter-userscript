import { JSDOM } from "jsdom";

import { AccessToken } from "../../src/reddit/AccessToken";

describe("AccessToken", () => {
    let accessTokenInstance: AccessToken;

    beforeEach(() => {
        accessTokenInstance = new AccessToken();
    });

    describe("fromTokenV2", () => {
        test("sanitized real-world test", () => {
            const accessToken = [
                btoa(JSON.stringify({
                    "alg": "RS256",
                    "kid": "SHA256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "typ": "JWT"
                })).replaceAll("=", ""),
                btoa(JSON.stringify({
                    "sub": "loid",
                    "exp": 12.34,
                    "iat": 56.78,
                    "jti": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    "cid": "secretsecret",
                    "lid": "aaaaaaaa",
                    "lca": 9,
                    "scp": "secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret",
                    "flo": 1
                })).replaceAll("=", ""),
                "secretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecretsecret"
            ].join(".");

            const tokenV2 = [
                btoa(JSON.stringify({
                    "alg": "HS256",
                    "typ": "JWT"
                })).replaceAll("=", ""),
                btoa(JSON.stringify({
                    "sub": accessToken,
                    "exp": 123,
                    "loggedIn": true,
                    "scopes": ["*", "email", "pii"],
                    "cid": "secretsecret"
                })).replaceAll("=", ""),
                "secretsecretsecretsecretsecretsecretsecretsecret"
            ].join(".");

            expect(accessTokenInstance.fromTokenV2(tokenV2)).toBe(accessToken);
        });
    });

    describe("from___r", () => {
        test("should extract access token from ___r object", () => {
            const accessToken = "abc123";
            const ___r: any = {
                user: {
                    session: {
                        accessToken: accessToken
                    }
                }
            };

            expect(accessTokenInstance.from___r(___r)).toBe(accessToken);
        });
    });

    describe("fromWindow", () => {
        test("should extract access token from Window object", () => {
            const accessToken = "abc123";
            const window: any = {
                ___r: {
                    user: {
                        session: {
                            accessToken: accessToken
                        }
                    }
                }
            };

            expect(accessTokenInstance.fromWindow(window)).toBe(accessToken);
        });

        test("should throw error if ___r doesn't exist on the Window object", () => {
            expect(() => accessTokenInstance.fromWindow({} as any)).toThrow();
        });
    });

    describe("fromDocument", () => {
        test("should extract access token from Document object", () => {
            const accessToken = "abc123";
            /* eslint-disable max-len */
            const document = new JSDOM(`<html><body><script id="data">window.___r = {"user":{"session":{"accessToken":"${accessToken}"}}};</script></body></html>`).window.document;

            expect(accessTokenInstance.fromDocument(document)).toBe(accessToken);
        });

        test("should throw error if data ID doesn't exist on the Document object", () => {
            const document = new JSDOM("<html><body></body></html>").window.document;

            expect(() => accessTokenInstance.fromDocument(document)).toThrow();
        });

        test("should throw error if data can't be parsed", () => {
            const document = new JSDOM('<html><body><script id="data"></script></body></html>').window.document;

            expect(() => accessTokenInstance.fromDocument(document)).toThrow();
        });
    });
});