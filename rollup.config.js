import internalJSON from "./scripts/rollup-plugin-internal-json.js";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import path from "path";
import prettier from "rollup-plugin-prettier";
import terser from "@rollup/plugin-terser";
import userscript from "rollup-plugin-userscript";

import pkg from "./package.json" with { type: "json" };

function nestedValue(object, keys) {
    return keys.reduce((previousObject, key) => previousObject[key], object);
}

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
            userscript((metadata) => {
                let result = metadata;

                // Replace "{{package.***}}" with values from package.json
                for (const match of metadata.matchAll(/{{package\.(.*)}}/g)) {
                    const packagePath = match[1].split(".");
                    const resolvedPackageValue = nestedValue(pkg, packagePath);
                    result = result.replace(match[0], resolvedPackageValue);
                }

                return result;
            })
        ]
    }
];