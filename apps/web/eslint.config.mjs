import tseslint from 'typescript-eslint'

export default [
  { ignores: ['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts'] },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
]
