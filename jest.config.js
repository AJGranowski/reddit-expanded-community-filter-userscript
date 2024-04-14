import pkg from "./package.json" assert { type: "json" };

export default {
    collectCoverage: true,
    coverageDirectory: pkg.config.jestCoverageDir,
    coverageReporters: [
        "html",
        "lcov",
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
    maxWorkers: 1, // https://jestjs.io/docs/troubleshooting#tests-are-extremely-slow-on-docker-andor-continuous-integration-ci-server
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["<rootDir>/tst/setup.ts"],
    testEnvironment: "jsdom",
    testRegex: "/tst/.*\\.(test|spec)?\\.(ts|tsx)$",
    transform: { "^.+\\.ts?$": "ts-jest" }
};