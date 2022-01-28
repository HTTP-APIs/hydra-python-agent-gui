// Converted to JS file, Now we can add comments
module.exports = {
  settings: {
    react: {
      version: "latest",
    },
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
      arrowFunctions: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "require-jsdoc": 0,
    "max-len": [
      1,
      {
        ignoreComments: true,
        code: 120,
      },
    ],
    camelcase: 0,
    "react/prop-types": 0,
    "no-invalid-this": 0,
    "guard-for-in": 0,
    "prefer-const": [
      "error",
      {
        destructuring: "any",
        ignoreReadBeforeAssign: false,
      },
    ],
    "no-unused-vars": ["error", { args: "none" }],
    "no-console": 0,
  },
};
