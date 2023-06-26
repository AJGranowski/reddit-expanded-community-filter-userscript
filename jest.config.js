module.exports = {
    collectCoverage: true,
    coverageDirectory: "build/jest-coverage/",
    coverageReporters: [
        "html"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom",
    testRegex: "/tst/.*\\.(test|spec)?\\.(ts|tsx)$",
    transform: { "^.+\\.ts?$": "ts-jest" }
};