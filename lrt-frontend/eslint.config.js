const vue = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');

module.exports = [
  // Für .vue Dateien
  {
    files: ['**/*.vue'],
    ignores: [
        'node_modules',
        '*.config.js',
        'config/**',
        'scripts/**',
        'dist',
    ],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: { vue },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/no-v-html': 'off',
      // weitere Vue-spezifische Regeln nach Bedarf
    },
  },
  // Für .js, .ts, .jsx, .tsx Dateien
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules',
      '*.config.js',
      'config/**',
      'scripts/**',
      'dist',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'error',
    },
  },
];
