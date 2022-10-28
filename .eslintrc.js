module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard", "prettier", "jest"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest"],
  rules: {},
};
