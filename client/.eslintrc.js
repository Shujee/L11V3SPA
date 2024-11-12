/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: [
    'dist/', // Exclude the dist folder
    'node_modules/', // Exclude node_modules folder
    '*.min.js', // Exclude minified JS files
    'src/**/*.test.js', // Exclude test files
  ],
  extends: [
    '@vue/eslint-config-typescript',
    'eslint-config-vuetify',
  ],
  rules: {
    indent: ['warn', 2],
    'vue/script-indent': ['warn', 2],
    'vue/multi-word-component-names': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 8,
      },
      multiline: {
        max: 5,
      },
    }],
  },
  overrides: [
    {
      files: ['*.ts'], // Lint .ts and .vue files
      rules: {
        indent: ['warn', 2, { SwitchCase: 1 }], // Global indent rule
        'vue/script-indent': ['warn', 2], // Vue script block indent
        '@typescript-eslint/indent': ['warn', 2], // Enforce indent in .ts files
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
}
