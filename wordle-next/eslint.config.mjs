/* eslint-disable import/no-anonymous-default-export */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import local from "eslint-plugin-local";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		linterOptions: {
			reportUnusedDisableDirectives: "off",
		},
	},
	{
		ignores: [
			"scripts/",
			"storybook-static/",
			"**/*.css",
			"**/*.module.css",
		],
	},
	...compat.extends("next", "next/core-web-vitals", "prettier"),
	{
		plugins: {
			prettier,
			local,
		},
		rules: {
			"prettier/prettier": "error",
			"no-console": "warn",
			"no-debugger": "error",
			"id-length": [
				"warn",
				{
					min: 3,
					max: 40,
					exceptions: [
						"id",
						"eq",
						"to",
						"Up",
						"up",
						"on",
						"fn",
						"ws",
						"vm",
						"RD",
						"ML",
					],
					exceptionPatterns: ["^_.*"],
				},
			],
			camelcase: "off",
			"import/prefer-default-export": "off",
			"react/jsx-filename-extension": "off",
			"react/jsx-props-no-spreading": "off",
			"react/no-unused-prop-types": "off",
			"react/require-default-props": "off",
			"react/no-unescaped-entities": "off",
			"react/react-in-jsx-scope": "off",
			"react/jsx-indent-props": "off",
			"react/prop-types": "off",
			"react/jsx-indent": "off",
			"react/display-name": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"import/extensions": [
				"error",
				"ignorePackages",
				{
					ts: "never",
					tsx: "never",
					js: "never",
					jsx: "never",
				},
			],
			"import/no-default-export": 1,
			"import/default": "off",
			"no-restricted-imports": [
				"error",
				{
					patterns: ["!./*", "!../*"],
				},
			],
			eqeqeq: ["error", "always"],
			"local/no-reatom-import": "warn",
			"local/no-antd-import": "warn",
		},
	},
	...compat
		.extends("plugin:@typescript-eslint/recommended", "prettier")
		.map((config) => ({
			...config,
			files: ["**/*.+(ts|tsx)"],
		})),
	{
		files: ["**/*.+(ts|tsx)"],
		plugins: {
			"@typescript-eslint": typescriptEslintEslintPlugin,
		},
		languageOptions: {
			parser: tsParser,
		},
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-loss-of-precision": "warn",
			"@typescript-eslint/no-var-requires": "off",
			"@typescript-eslint/no-use-before-define": "off",
			"@typescript-eslint/ban-ts-comment": "warn",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					vars: "all",
					args: "after-used",
					ignoreRestSiblings: false,
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-unsafe-function-type": "off",
			"no-use-before-define": [0],
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
	{
		files: ["src/pages/**/*", "**/*.story.*"],
		rules: {
			"import/no-default-export": "off",
		},
	},
];
