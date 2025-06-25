// backend/eslint.config.js
const eslintPluginNode = require('eslint-plugin-n');
const eslintPluginImport = require('eslint-plugin-import');

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'node_modules',
      '*.config.js',
      'config/**',
      'scripts/**',
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
    plugins: {
      n: eslintPluginNode,
      import: eslintPluginImport,
    },
    rules: {
      // Node-spezifisch
      'n/no-missing-import': 'error',
      'n/no-unsupported-features/es-syntax': 'off', // für moderne Syntax
      'n/no-process-exit': 'off',

      // Code-Qualität & Stil
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off', // kannst du auf 'warn' oder 'error' stellen
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],

      // Import/Export Regeln
      'import/order': [
        'warn',
        {
          'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',
    },
  },
];
