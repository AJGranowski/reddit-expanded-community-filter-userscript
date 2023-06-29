import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import metablock from "rollup-plugin-userscript-metablock";
import nodeResolve from "@rollup/plugin-node-resolve";
import prettier from "rollup-plugin-prettier";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json" assert { type: "json" };

export default [
    {
        input: `${pkg.config.typescriptDir}/index.js`,
        output: [
            {
                file: `${pkg.config.rollupDir}/bundle.js`,
                format: "esm",
                sourcemap: false
            }
        ],
        plugins: [
            json(),
            nodeResolve({
                browser: true,
                preferBuiltins: false
            }),
            commonjs(),
            terser({
                /*
                 * "Code posted to Greasy Fork must not be obfuscated or minified."
                 * https://greasyfork.org/en/help/code-rules
                 *
                 * Makes Terser a bit more friendly to read.
                 */
                compress: {
                    booleans: false,
                    conditionals: false,
                    ecma: 2022,
                    reduce_funcs: false,
                    reduce_vars: false,
                    sequences: false,
                    toplevel: true,
                    unsafe_arrows: true
                },
                format: {
                    beautify: true,
                    indent_level: 2
                },
                mangle: false
            }),
            prettier({
                /*
                 * "Users must be given the opportunity to inspect and understand a script before installing it."
                 * https://greasyfork.org/en/help/code-rules
                 *
                 * Some final formatting of the line lengths after terser.
                 */
                printWidth: 120
            }),
            metablock({
                file: "script-metadata.json",
                order: ["name", "description", "version", "author", "homepage"],
                override: {
                    author: pkg.author,
                    description: pkg.description,
                    license: pkg.license,
                    version: pkg.version
                }
            })
        ]
    }
];