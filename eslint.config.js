import eslintjs from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

const pkg = {
    config: {
        buildDir: "build/",
        tstDir: "tst/"
    }
};

export default tseslint.config(
    {
        ignores: [`${pkg.config.buildDir}`, "node_modules/"]
    },
    eslintjs.configs.recommended,
    sonarjs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.greasemonkey
            },
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.eslint.json"
            }
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            jest: jestPlugin
        },
        rules: {
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/explicit-function-return-type": "error",
            "arrow-parens": ["error", "always"],
            "arrow-spacing": ["error", {
                "before": true,
                "after": true
            }],
            "block-spacing": ["error", "never"],
            "brace-style": ["error", "1tbs", {"allowSingleLine": true}],
            "comma-dangle": ["error", "never"],
            "comma-spacing": "error",
            "comma-style": "error",
            "complexity": ["error", 8],
            "eol-last": ["error", "never"],
            "func-call-spacing": "error",
            "implicit-arrow-linebreak": ["error", "beside"],
            "indent": ["error", 4],
            "key-spacing": "error",
            "linebreak-style": ["error", "unix"],
            "lines-between-class-members": ["error", "always", {"exceptAfterSingleLine": true}],
            "max-depth": ["error", 3],
            "max-len": ["error", 160],
            "max-params": ["error", 5],
            "new-parens": "error",
            "no-mixed-spaces-and-tabs": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": "error",
            "no-tabs": "error",
            "no-trailing-spaces": "error",
            "no-whitespace-before-property": "error",
            "object-curly-newline": ["error", {
                "multiline": true,
                "minProperties": 4,
                "consistent": true
            }],
            "operator-linebreak": ["error", "after"],
            "padding-line-between-statements": [
                "error",
                {"blankLine": "always", "prev": "multiline-block-like", "next": "*"}
            ],
            "quotes": ["error", "double", "avoid-escape"],
            "rest-spread-spacing": ["error", "never"],
            "semi": ["error", "always"],
            "semi-spacing": ["error", {"before": false, "after": true}],
            "semi-style": ["error", "last"],
            "sonarjs/class-name": "off",
            "sonarjs/cognitive-complexity": ["error", 8],
            "sonarjs/constructor-for-side-effects": "off",
            "sonarjs/function-return-type": "off",
            "sonarjs/new-cap": "off",
            "sonarjs/no-empty-function": "off",
            "sonarjs/no-hardcoded-credentials": "off",
            "sonarjs/no-invalid-await": "off",
            "sonarjs/no-misused-promises": "off",
            "sonarjs/no-nested-functions": "off",
            "sonarjs/no-redundant-type-constituents": "off",
            "sonarjs/prefer-nullish-coalescing": "off",
            "sonarjs/prefer-promise-shorthand": "off",
            "sonarjs/sonar-prefer-optional-chain": "off",
            "sonarjs/sonar-prefer-regexp-exec": "off",
            "sonarjs/slow-regex": "off",
            "space-before-blocks": ["error", "always"],
            "space-before-function-paren": ["error", {
                "anonymous": "ignore",
                "named": "never",
                "asyncArrow": "always"
            }],
            "space-in-parens": ["error", "never"],
            "space-infix-ops": ["error", {"int32Hint": true}],
            "template-curly-spacing": ["error", "never"],
            "wrap-iife": ["error", "inside"]
        }
    },
    {
        ...tseslint.configs.disableTypeChecked,
        files: ["**/*.cjs", "**/*.js"],
        rules: {
            ...tseslint.configs.disableTypeChecked.rules,
            "@typescript-eslint/internal/no-poorly-typed-ts-props": "off",
            "@typescript-eslint/explicit-function-return-type": "off"
        }
    },
    {
        ...jestPlugin.configs["flat/recommended"],
        files: [`${pkg.config.tstDir}/**`],
        rules: {
            ...jestPlugin.configs["flat/recommended"].rules,
            "sonarjs/no-duplicate-string": "off"
        }
    }
);