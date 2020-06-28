module.exports = {
  extends: '@loopback/eslint-config',
  overrides: [
    {
      files: ['**/__tests__/**/*.*'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
  ],
};
