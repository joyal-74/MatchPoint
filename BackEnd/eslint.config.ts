import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import unusedImports from "eslint-plugin-unused-imports";
import prettierConfig from "eslint-config-prettier";

/** 
 * @type {import("eslint").Linter.FlatConfig[]}
 *  */
export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    prettierConfig,

    {
        files: ["**/*.{ts,tsx,js,jsx}"],

        languageOptions: {
            parser: tseslint.parser,
            globals: {
                ...globals.node,
            },
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
        },

        plugins: {
            "unused-imports": unusedImports,
        },

        rules: {
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            "no-unused-vars": "off",

            "@typescript-eslint/no-explicit-any": "error",
        },
    },
];
