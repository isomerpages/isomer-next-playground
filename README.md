# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Schema Validation Tool

This tool validates JSON schema files against a base schema to ensure consistency and correctness.

### Prerequisites

- NPM package manager
- JSON schema files to validate placed in the `schema` directory
  - The tool will recursively check all `.json` files in the `schema` directory
- Base schema file located at `public/0.1.0.json`

### Usage

Run the schema validation tool using:
```bash
npm run validate-schema
```
### Output

The tool will:

1. Scan all schema files and display the total count
2. For invalid schemas:
   - List each invalid file with its path
   - Show validation errors in red with ✗ symbol
   - Display detailed error messages showing the path and issue
3. For valid schemas:
   - List each valid file with its path
   - Show green ✓ symbol to indicate validity
4. Generate a summary showing:
   - Total number of files scanned
   - Number of invalid files
   - Full validation report saved to `schema-validation-report.txt`
