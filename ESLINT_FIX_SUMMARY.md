# ESLint Pipeline Fix Summary

## Problem
The CI/CD pipeline was failing due to ESLint version incompatibility:
- Next.js 14.2.33 was installed
- ESLint v9.37.0 and eslint-config-next v15.5.5 were installed
- ESLint v9 requires flat config format, but project used `.eslintrc.json`
- eslint-config-next v15 requires ESLint v9, but Next.js 14 is designed for ESLint v8

Error message:
```
Invalid Options:
- Unknown options: useEslintrc, extensions, resolvePluginsRelativeTo, rulePaths, ignorePath, reportUnusedDisableDirectives
```

## Solution
Downgrade ESLint and eslint-config-next to versions compatible with Next.js 14:

### 1. Update package.json
Change devDependencies:
```json
"devDependencies": {
  "eslint": "^8.57.0",          // was ^9.37.0
  "eslint-config-next": "^14.2.33",  // was ^15.5.5
  ...
}
```

### 2. Install dependencies
```bash
npm install
```

### 3. Fix linting errors
Run `npm run lint` and fix any errors found. In this project, there were 4 react/no-unescaped-entities errors:

- Replace `'` with `&apos;` in JSX text content
- Files affected:
  - `src/app/(app)/payloads/page.tsx`
  - `src/components/ErrorBoundary.tsx`
  - `src/components/OperationWizard.tsx`

### 4. Verify
```bash
npm run lint  # Should pass with exit code 0
npm run build # Should succeed
```

## To Apply to PR #5
1. Checkout the PR #5 branch
2. Apply the package.json changes above
3. Run `npm install`
4. Run `npm run lint` and fix any linting errors
5. Run `npm run build` to verify
6. Commit and push the changes

## Benefits
- ✅ Compatible with Next.js 14
- ✅ Uses stable ESLint v8
- ✅ Keeps familiar `.eslintrc.json` format
- ✅ No breaking changes to existing code
- ✅ CI/CD pipeline passes
