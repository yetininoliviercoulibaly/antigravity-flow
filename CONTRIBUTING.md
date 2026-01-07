# Contributing to Antigravity Workflow CLI

Thank you for your interest in contributing! We aim for high quality, "Clean Code" standards.

## Architecture

This project follows a Pragmatic SOLID architecture:

- **`src/core`**: Pure business logic (Business Rules, Interfaces). No external dependencies (node, fs, etc.).
- **`src/adapters`**: Concrete implementations of core interfaces (e.g., Node.js FileSystem).
- **`src/commands`**: CLI logic and user interaction.

## Development Setup

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run test` to ensure everything is working.
4.  Run `npm run build` to compile.

## Adding a new Workflow

1.  Add the workflow role to `src/core/types.ts`.
2.  Create the template in `src/templates/<role>.md.ejs`.
3.  Add the role to the `choices` list in `src/commands/init.ts` (or ensure it's dynamically loaded).
4.  Run tests.

## Coding Standards

- **Strict TypeScript**: No `any` unless absolutely necessary.
- **Prettier/ESLint**: Code must be linted.
