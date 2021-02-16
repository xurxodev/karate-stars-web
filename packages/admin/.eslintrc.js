module.exports = {
    extends: ["../../.eslintrc.js", "react-app", "plugin:react/recommended"],
    parser: "@typescript-eslint/parser",
    env: {
        node: true,
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    rules: {
        "react/prop-types": "off",
        "react-hooks/exhaustive-deps": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};
