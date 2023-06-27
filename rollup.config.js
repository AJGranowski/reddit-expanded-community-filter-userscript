import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import metablock from "rollup-plugin-userscript-metablock";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import pkg from "./package.json" assert { type: "json" };

export default [
    {
        input: `${pkg.config.typescriptDir}/index.js`,
        output: [
            {
                file: `${pkg.config.rollupDir}/bundle.js`,
                format: "esm",
                sourcemap: false,
            }
        ],
        plugins: [
            json(),
            nodeResolve({
                browser: true,
                preferBuiltins: false
            }),
            commonjs(),
            terser(),
            metablock({
                file: "script-metadata.json",
                override: {
                    author: pkg.author,
                    description: pkg.description,
                    version: pkg.version
                }
            })
        ]
    }
];