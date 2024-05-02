import pkg from "./package.json" with { type: "json" };

export default {
    collectCoverage: true,
    coverageDirectory: pkg.config.jestCoverageDir,
    coveragePathIgnorePatterns: ["node_modules/", pkg.config.buildDir, pkg.config.tstDir],
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
        [`${pkg.config.srcDir}/userscript/**`]: {
            branches: 100,
            functions: 100,
            statements: 100
        },
        [`${pkg.config.srcDir}/utilities/**`]: {
            branches: 100,
            functions: 100,
            statements: 100
        }
    },
    maxWorkers: 1, // https://jestjs.io/docs/troubleshooting#tests-are-extremely-slow-on-docker-andor-continuous-integration-ci-server
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    setupFilesAfterEnv: ["<rootDir>/tst/setup.ts"],
    testEnvironment: "jsdom",
    testRegex: `${pkg.config.tstDir}.*\\.(test|spec)?\\.(ts|tsx)$`,
    transform: { "^.+\\.ts?$": "ts-jest" }
};