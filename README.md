# 🚀 Antigravity Workflow CLI

[![NPM Version](https://img.shields.io/npm/v/antigravity-flow)](https://www.npmjs.com/package/antigravity-flow)

**Enforce strict, agentic workflows in your development projects.**

Antigravity Flow (`ag-flow`) is a CLI tool originally built to prepare projects for **Google Antigravity**. It has since evolved into a **universal context generator** that standardizes development workflows for all AI-native IDEs, including **Cursor**, **Windsurf**, **Gemini Code Assist**, and **GitHub Copilot**.

It generates context-aware rules, workflows, and CI/CD pipelines tailored to your project's technology stack and architecture.

## ✨ Features

- **🎭 Role-Based Workflows**: Generate specific prompt instructions for:
  - Developers, QA, Lead Devs, Architects, POs, BAs
  - **NEW**: DevOps, Security Engineers, Tech Writers, Data Engineers
- **🏗️ Architecture-Aware**: Supports **Hexagonal**, **Clean**, **Vertical Slice (FSD)**, **MVC**, **Layered**, **Microservices**.
- **🌐 Internationalization (I18n)**: Fully localized in **English** 🇺🇸 and **French** 🇫🇷.
- **📏 Rigor Modes**:
  - **Strict**: Enforces TDD, 100% coverage, no `any`, mandatory docs.
  - **Standard**: Balanced approach with 80% coverage target.
  - **Prototype**: Speed-focused, allows `// TODO` debt, optional TDD.
  - **Legacy**: For maintaining older codebases with characterization tests.
- **🤖 Agent Context**: Generates `.agent/project-context.md` to prime your AI agent.
- **🔌 IDE Integration**: Automatically configures:
  - **Cursor** (`.cursor/rules/*.mdc`)
  - **Windsurf** (`.windsurfrules`, `.windsurf/rules/`)
  - **Gemini Code Assist** (`.gemini/settings.json`)
  - **GitHub Copilot**
- **🚀 Generators**:
  - **CI/CD**: GitHub Actions pipelines.
  - **Dockerfile**: Production-ready, multi-stage builds.
  - **.gitignore**: Optimized rules for your stack.
  - **Customizable**: Use `ag-flow templates` to eject and modify any internal template.
- **💡 Intelligent Discovery**: Auto-detects your tech stack to pre-fill prompts.
- **💾 Configuration Persistence**: Saves your choices to `.agent/antigravity.json`.
- **📦 Monorepo Support**: Turborepo, Nx, Lerna, pnpm/yarn workspaces.

## 📦 Installation

```bash
npm install -g antigravity-flow
# Or run without installing:
npx antigravity-flow init
```

## 🚀 Usage

Navigate to your project root and run:

```bash
ag-flow init
# or with configuration file (Non-interactive):
ag-flow init --config ./antigravity.json
# or
npx antigravity-flow init
```

To view the comprehensive user guide directly in your terminal:

```bash
ag-flow guide
# or for French:
ag-flow guide fr
```

### Template Customization (NEW)

You can view and customize any internal template (prompts, rules, Dockerfiles):

```bash
# List all available templates
ag-flow templates list

# Eject and edit a template (opens system editor)
ag-flow templates update docker/django.Dockerfile.ejs
```

The CLI will automatically prioritize your local templates in `.agent/templates/`.

### Interactive Prompts

The CLI will guide you through:

1.  **Language**: English (en) or French (fr).
2.  **Project Description**: Brief overview of your project.
3.  **Tech Stack**:
    - Frontend, Backend, Mobile, Smart Contracts
4.  **Database & ORM**: PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, etc.
5.  **Architecture**: Hexagonal, Clean, MVC, Feature-Sliced, Microservices.
6.  **Rigor Mode**: Strict, Standard, Prototype, Legacy.
7.  **Version Control**: GitHub, GitLab, Azure DevOps, Bitbucket.
8.  **Branching Strategy**: GitFlow, GitHub Flow, Trunk-Based.
9.  **Package Manager**: npm, yarn, pnpm, bun, pip, poetry, cargo, etc.
10. **Testing Framework**: Jest, Vitest, Playwright, Cypress, pytest, etc.
11. **Deployment Platform**: Vercel, Netlify, AWS, Azure, GCP, Railway, etc.
12. **Security Scanning**: Snyk, Dependabot, Renovate, SonarQube.
13. **Monorepo**: Turborepo, Nx, Lerna, pnpm/yarn workspaces.
14. **Roles**: Select which workflows to generate.
15. **IDE Integration**: Cursor, Windsurf, Gemini, Copilot.

## 📂 Output Structure

```
.
├── .github/workflows/
│   └── ci.yml                  # Generated CI/CD pipeline
├── .agent/
│   ├── workflows/              # Role-specific prompt templates
│   │   ├── dev.md              # Developer workflow
│   │   ├── qa.md               # QA workflow
│   │   ├── architect.md        # Architect workflow
│   │   ├── devops.md           # DevOps workflow (NEW)
│   │   ├── security.md         # Security Engineer (NEW)
│   │   ├── techwriter.md       # Tech Writer (NEW)
│   │   └── data.md             # Data Engineer (NEW)
│   ├── rules/
│   │   └── coding-standards.md # Dynamic rules based on stack & rigor
│   ├── project-context.md      # High-level context for AI
│   └── antigravity.json        # Persisted configuration
├── .cursor/rules/              # Cursor IDE rules (if selected)
├── .windsurf/rules/            # Windsurf IDE rules (if selected)
└── .gemini/settings.json       # Gemini Code Assist (if selected)
```

## 🛠️ Supported Stacks

### Frontend

| Framework        | Type       |
| ---------------- | ---------- |
| React            | SPA        |
| Next.js          | SSR/SSG    |
| Vue.js           | SPA        |
| Nuxt.js          | SSR/SSG    |
| Angular          | SPA        |
| Svelte/SvelteKit | SPA/SSR    |
| Remix            | SSR        |
| Astro            | SSG        |
| Flutter          | Mobile/Web |
| React Native     | Mobile     |

### Backend

| Framework      | Language   |
| -------------- | ---------- |
| NestJS         | TypeScript |
| Express        | JavaScript |
| Fastify        | TypeScript |
| FastAPI        | Python     |
| Django         | Python     |
| Flask          | Python     |
| ASP.NET Core   | C#         |
| Spring Boot    | Java       |
| Go/Gin         | Go         |
| Rust           | Rust       |
| Elixir/Phoenix | Elixir     |

### Databases

| Relational | NoSQL     | Cloud       |
| ---------- | --------- | ----------- |
| PostgreSQL | MongoDB   | Supabase    |
| MySQL      | Redis     | Firebase    |
| SQL Server | Cassandra | DynamoDB    |
| Oracle     |           | PlanetScale |
| SQLite     |           | Neon        |

### Smart Contracts

| Platform  | Framework |
| --------- | --------- |
| Radix     | Scrypto   |
| Ethereum  | Solidity  |
| Solana    | Anchor    |
| Sui/Aptos | Move      |
| Polkadot  | ink!      |

## 🎭 Available Roles

| Role              | Description                         |
| ----------------- | ----------------------------------- |
| Developer         | Standard development loop with TDD  |
| QA                | Testing, coverage, security testing |
| Lead Developer    | Code review, standards, mentoring   |
| Architect         | System design, ADRs, observability  |
| Product Owner     | Backlog, INVEST, DoD/DoR            |
| Business Analyst  | DDD, Event Storming, specs          |
| **DevOps**        | CI/CD, IaC, monitoring              |
| **Security**      | Audits, pentesting, compliance      |
| **Tech Writer**   | API docs, guides, standards         |
| **Data Engineer** | Pipelines, ETL, data quality        |

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
