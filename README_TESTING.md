# Testing Setup

## Installation

Before running tests, make sure to install dependencies:

```bash
cd frontend
npm install
```

## Running Tests

```bash
npm test
```

## Type Errors

If you see TypeScript errors about missing Jest types, make sure:
1. Dependencies are installed: `npm install`
2. The `@types/jest` package is installed (already in package.json)

The test files are configured to work with Jest and React Testing Library once dependencies are installed.
