# Contributing to Antigravity Workflow CLI

Thank you for your interest in contributing! We aim for high quality, "Clean Code" standards and a robust feature set for V3/V4.

## 🏗️ Architecture

This project follows a Pragmatic SOLID architecture:

- **`src/core`**: Pure business logic (Business Rules, Interfaces, Generators). No external dependencies (node, fs, etc.).
- **`src/adapters`**: Concrete implementations of core interfaces (e.g., Node.js FileSystem, InquirerAdapter).
- **`src/commands`**: CLI logic and user interaction (Commander.js).
- **`src/templates`**: EJS templates for workflows, organized by language (`en`, `fr`, etc.).

## 🚀 Development Setup

1.  **Clone the repository**.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run Tests**:
    ```bash
    npm test
    ```
    _Note: We enforce a strict coverage policy. Run `npm test -- --coverage` to check._
4.  **Build**:
    ```bash
    npm run build
    ```
    _This compiles TypeScript and copies assets (templates/locales) to `dist/`._

## 🧪 Testing Standards

- **Goal**: >90% Code Coverage.
- **Requirement**: All new features MUST be accompanied by unit tests.
- **Mocking**: Use `jest` mocks for all external dependencies (`IFileSystem`, `inquirer`, etc.).

## 📝 How to Contribute

### Adding a New Workflow Role

1.  Add the role to `WorkflowRole` enum in `src/core/types.ts`.
2.  Create the template in `src/templates/en/<role>.md.ejs` (and other languages).
3.  Add the mapping in `WORKFLOW_FILES` in `src/core/types.ts`.

### Adding a New Language (I18n)

1.  Create a new JSON file in `src/locales/` (e.g., `es.json`).
2.  Duplicate the `src/templates/en` folder to `src/templates/es`.
3.  Translate all templates and fragments within that folder.

### Adding a New Rigor Mode

1.  Add the mode to `RigorMode` enum in `src/core/types.ts`.
2.  Create `strict.md.ejs`, `prototype.md.ejs`, or your new mode in `src/templates/<lang>/fragments/rigor/`.
3.  Update `InitCommand.ts` to include the new mode in the prompt choices.
4.  Update `RulesComposer.ts` to handle the inclusion logic if special handling is needed.

### Adding a New CI/CD Pipeline

1.  Create a new template in `src/templates/en/pipelines/` (e.g., `github-go.yml.ejs`).
2.  Update `PipelineGenerator.ts` logic to select this template based on `TechStack`.
3.  Add unit tests in `PipelineGenerator.spec.ts`.

## 🧹 Coding Standards

- **Strict TypeScript**: No `any` unless absolutely necessary (and justified with a comment).
- **Linter**: Ensure no linting errors before committing.
- **Format**: Use Prettier specific config.

## 🤝 Pull Request Process

1.  Ensure tests pass and coverage is maintained.
2.  Update `README.md` if you changed user-facing features.
3.  Describe your changes clearly in the PR.
