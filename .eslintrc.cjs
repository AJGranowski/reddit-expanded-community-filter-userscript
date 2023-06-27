module.exports = {
    "ignorePatterns": ["build/", "node_modules/"],
    "env": {
        "browser": true,
        "es2021": true
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
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double",
            "avoid-escape"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
