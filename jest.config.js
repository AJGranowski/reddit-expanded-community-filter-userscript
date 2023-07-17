import pkg from "./package.json" assert { type: "json" };

export default {
    collectCoverage: true,
    coverageDirectory: pkg.config.jestCoverageDir,
    coverageReporters: [
        "html",
        "text"
    ],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "jsdom",
    testRegex: "/tst/.*\\.(test|spec)?\\.(ts|tsx)$",
    transform: { "^.+\\.ts?$": "ts-jest" }
};