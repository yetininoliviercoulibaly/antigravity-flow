# Antigravity Workflow CLI

A CLI tool to enforce agentic workflows in your development projects.

## Features

- **Role-based Workflows**: Generate specific workflows for Developers, QA, Lead Devs, Architects, POs, and BAs.
- **Customizable**: Adapts to your project's build and test commands.
- **Agent-Ready**: Creates `.agent/workflows/` files optimized for AI Agents (like Google Antigravity).

## Installation

```bash
npm install -g antigravity-flow
```

## Usage

Navigate to your project root and run:

```bash
ag-flow init
```

Follow the interactive prompts to configure your project.

## Workflows Types

- **Developer (`dev`)**: Standard TDD loop.
- **QA (`qa`)**: Test planning and execution.
- **Lead Dev (`lead`)**: Code review and standards.
- **Architect (`architect`)**: System design.
- **Product Owner (`po`)**: Backlog management.
- **Business Analyst (`ba`)**: Requirements gathering.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
