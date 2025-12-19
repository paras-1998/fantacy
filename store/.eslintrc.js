module.exports = {
    overrides: [
      {
        files: ["**/*.js", "**/*.ts", "**/*.tsx"],
        rules: {
          "@typescript-eslint/no-explicit-any": "off",
        },
      },
    ],
  };
  