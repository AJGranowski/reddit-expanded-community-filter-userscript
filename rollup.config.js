import internalJSON from "./scripts/rollup-plugin-internal-json.js";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import prettier from "rollup-plugin-prettier";
import terser from "@rollup/plugin-terser";
import userscript from "rollup-plugin-userscript";

import pkg from "./package.json" with { type: "json" };

export default [
    {
        input: path.join(pkg.config.typescriptDir, pkg.config.srcDir, "index.js"),
        output: [
            {
                file: path.join(pkg.config.rollupDir, "bundle.js"),
                format: "esm",
                sourcemap: false
            }
        ],
        plugins: [
            internalJSON(),
            json({
                compact: true,
                include: path.join(pkg.config.typescriptDir, pkg.config.localeDir, "*"),
                namedExports: false,
                preferConst: true
            }),
            nodeResolve({
                browser: true,
                preferBuiltins: false
            }),
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
                    keep_fargs: false,
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
                 * Some final formatting after terser.
                 */
                bracketSpacing: false,
                parser: "babel",
                printWidth: 120,
                trailingComma: "none"
            }),
            userscript((meta) => {
                return meta.replace("{{package.author}}", pkg.author)
                    .replace("{{package.description}}", pkg.description)
                    .replace("{{package.license}}", pkg.license)
                    .replace("{{package.name}}", pkg.name)
                    .replace("{{package.version}}", pkg.version);
            })
        ]
    }
];