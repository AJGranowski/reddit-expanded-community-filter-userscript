module.exports = {
    "ignorePatterns": ["build/", "node_modules/"],
    "env": {
        "browser": true,
        "es2022": true,
        "greasemonkey": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        },
        {
            files: [
                "**/*.test.js"
            ],
            env: {
                jest: true
            },
            plugins: ["jest"],
            rules: {
                "@typescript-eslint/no-non-null-assertion": 0, // Doesn't work
                "jest/no-disabled-tests": "warn",
                "jest/no-focused-tests": "error",
                "jest/no-identical-title": "error",
                "jest/prefer-to-have-length": "warn",
                "jest/valid-expect": "error"
            }
        },
        {
            files: [
                "*.js",
                "*.cjs"
            ],
            rules: {
                "@typescript-eslint/explicit-function-return-type": "off"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
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
            { "blankLine": "always", "prev": "multiline-block-like", "next": "*" }
        ],
        "quotes": ["error", "double", "avoid-escape"],
        "rest-spread-spacing": ["error", "never"],
        "semi": ["error", "always"],
        "semi-spacing": ["error", {"before": false, "after": true}],
        "semi-style": ["error", "last"],
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
};