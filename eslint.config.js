import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

const layout = stylistic.configs.customize({
  arrowParens: true,
  blockSpacing: true,
  braceStyle: "1tbs",
  commaDangle: "always-multiline",
  indent: 2,
  jsx: false,
  quoteProps: "as-needed",
  quotes: "double",
  semi: true,
  severity: "error",
});

export default defineConfig(
  globalIgnores(["coverage/", "lib/", "eslint.config.js"]),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    linterOptions: { reportUnusedDisableDirectives: "error" },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: layout.plugins,
    rules: {
      ...layout.rules,
      "@stylistic/generator-star-spacing": [
        "error",
        {
          after: true,
          before: false,
          method: { after: false, before: true },
        },
      ],
      "@stylistic/indent": [
        "error",
        2,
        {
          ArrayExpression: 1,
          CallExpression: { arguments: 1 },
          flatTernaryExpressions: false,
          FunctionDeclaration: { body: 1, parameters: 1, returnType: 1 },
          FunctionExpression: { body: 1, parameters: 1, returnType: 1 },
          ignoreComments: false,
          ignoredNodes: [
            "TSUnionType",
            "TSUnionType *",
            "TSIntersectionType",
            "TSIntersectionType *",
          ],
          ImportDeclaration: 1,
          MemberExpression: 1,
          ObjectExpression: 1,
          offsetTernaryExpressions: true,
          outerIIFEBody: 1,
          SwitchCase: 1,
          VariableDeclarator: 1,
        },
      ],
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/max-len": [
        "error",
        {
          code: 80,
          tabWidth: 2,
          ignorePattern: "^\\s*(// eslint-disable-next-line |[\"'`].*[\"'`],?( \\+)?$)",
          ignoreRegExpLiterals: true,
          ignoreUrls: true,
        },
      ],
      "@stylistic/operator-linebreak": [
        "error",
        "after",
        { overrides: { "?": "before", ":": "before", "|": "before" } },
      ],
      "@stylistic/quotes": [
        "error",
        "double",
        { allowTemplateLiterals: "always", avoidEscape: true },
      ],
      "@stylistic/indent-binary-ops": "off",
      "@stylistic/lines-between-class-members": "off",
      "@stylistic/no-mixed-operators": "off",
      "@stylistic/no-tabs": "off",
      "@stylistic/spaced-comment": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    plugins: { jsdoc },
    settings: {
      jsdoc: {
        mode: "typescript",
        tagNamePreference: { template: "typeParam" },
      },
    },
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "no-console": "error",
      "no-eval": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": [
        "error",
        {
          definedTags: [
            "defaultValue",
            "packageDocumentation",
            "remarks",
            "typeParam",
          ],
        },
      ],
      "jsdoc/no-types": "error",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
      "jsdoc/require-jsdoc": [
        "error",
        {
          publicOnly: true,
          contexts: ["TSInterfaceDeclaration", "TSTypeAliasDeclaration"],
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
    },
  },
  {
    files: ["tests/**/*.ts"],
    plugins: vitest.configs.recommended.plugins,
    rules: vitest.configs.recommended.rules,
  },
);
