module.exports = {
  env: { 
    jest: true,
    browser: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
  ],
  rules: {
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'quote-props': ['warn', 'as-needed'],
  },
  overrides: [
    {
      files: [
        '*.config.js',
        'process/**/*.js',
      ],
      env: {
        node: true,
      },
    },
  ],
};
