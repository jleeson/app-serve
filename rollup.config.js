/* imports */
import { terser } from "rollup-plugin-terser";
import { dependencies } from "./package.json";
import { builtinModules } from "module";

/* build config */
export default {
    input: "src/index.js",
    output: [
        { file: "dist/app-serve.esm.js", format: "esm" },
        { file: "dist/app-serve.cjs.js", format: "cjs", exports: "default" },
    ],
    plugins: [
        terser({
            output: {
                preamble: "/* Copyright (c) 2021 Outwalk Studios */"
            }
        })
    ],
    external: builtinModules.concat(Object.keys(dependencies))
};