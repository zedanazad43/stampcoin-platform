const baseRules = {
  "no-undef": "error",
  "no-unreachable": "error",
  "no-unused-vars": ["error", { argsIgnorePattern: "^_" }]
};

const nodeGlobals = {
  __dirname: "readonly",
  clearTimeout: "readonly",
  console: "readonly",
  fetch: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
  setTimeout: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly"
};

const browserGlobals = {
  clearTimeout: "readonly",
  console: "readonly",
  document: "readonly",
  fetch: "readonly",
  FormData: "readonly",
  globalThis: "readonly",
  Intl: "readonly",
  localStorage: "readonly",
  requestAnimationFrame: "readonly",
  sessionStorage: "readonly",
  setTimeout: "readonly",
  URLSearchParams: "readonly",
  window: "readonly"
};

module.exports = [
  {
    ignores: ["node_modules/**"]
  },
  {
    files: ["server.js", "tests/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: nodeGlobals
    },
    rules: baseRules
  },
  {
    files: ["public/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...browserGlobals,
        module: "readonly"
      }
    },
    rules: baseRules
  }
];
