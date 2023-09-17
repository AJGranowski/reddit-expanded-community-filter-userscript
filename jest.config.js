import pkg from "./package.json" assert { type: "json" };

export default {
    collectCoverage: true,
    coverageDirectory: pkg.config.jestCoverageDir,
    coverageReporters: [
        "html",
        "text"
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 80,
            statements: 80
        },
        "src/userscript/**": {
            branches: 100,
            functions: 100,
            statements: 100
        },
        "src/utilities/**": {
            branches: 100,
            functions: 100,
            statements: 100
        }
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["<rootDir>/tst/setup.ts"],
    testEnvironment: "jsdom",
    testRegex: "/tst/.*\\.(test|spec)?\\.(ts|tsx)$",
    transform: { "^.+\\.ts?$": "ts-jest" }
};