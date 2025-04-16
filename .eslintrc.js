module.exports = {
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
            presets: ["@babel/preset-react"],
        },
    },
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["react", "react-hooks", "import"],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        },
    },
    rules: {
        "no-console": "warn",
        indent: "off",
        "linebreak-style": ["error", "unix"],
        "no-unused-vars": "warn",
        quotes: ["off", "double"],
        semi: ["error", "always"],
        "no-case-declarations": "off",
        "no-empty": "off", // Disable the no-empty rule
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",

        "no-useless-escape": "off",
        "no-unexpected-multiline": "off",

        "max-len": "off",

        "prettier/prettier": [
            "error",
            {
                tabWidth: 4,
                printWidth: 80,
                semi: true,
                singleQuote: false,
                trailingComma: "es5",
                bracketSpacing: true,
                arrowParens: "always",
                endOfLine: "lf",
            },
        ],
    },
    globals: {
        Handlebars: true,
        helpers: true,
        Map: true,
        services: true,
        Templates: true,
        ZAFClient: true,
        Quill: true,
        llEvents: true,
        llTranslate: true,
        llLog: true,
        Chart: true,
    },
    // Simplified handling for TypeScript files
    ignorePatterns: ["**/*.d.ts"],
};
