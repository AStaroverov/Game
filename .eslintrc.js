module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
    },
    plugins: ['unused-imports', 'simple-import-sort'],
    extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'prettier',
        'prettier/prettier',
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'simple-import-sort/imports': 'error',

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',

        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-types': 'off',
    },
};
