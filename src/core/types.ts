export enum WorkflowRole {
  DEVELOPER = 'dev',
  QA = 'qa',
  LEAD_DEV = 'lead',
  ARCHITECT = 'architect',
  PRODUCT_OWNER = 'po',
  BUSINESS_ANALYST = 'ba',
  DEVOPS = 'devops',
  SECURITY = 'security',
  TECH_WRITER = 'techwriter',
  DATA_ENGINEER = 'data',
  RULES = 'rules',
}

export const WORKFLOW_FILES = {
  [WorkflowRole.DEVELOPER]: 'dev.md',
  [WorkflowRole.QA]: 'qa.md',
  [WorkflowRole.LEAD_DEV]: 'lead.md',
  [WorkflowRole.ARCHITECT]: 'architect.md',
  [WorkflowRole.PRODUCT_OWNER]: 'po.md',
  [WorkflowRole.BUSINESS_ANALYST]: 'ba.md',
  [WorkflowRole.DEVOPS]: 'devops.md',
  [WorkflowRole.SECURITY]: 'security.md',
  [WorkflowRole.TECH_WRITER]: 'techwriter.md',
  [WorkflowRole.DATA_ENGINEER]: 'data.md',
  [WorkflowRole.RULES]: 'coding-standards.md',
};

export interface WorkflowConfig {
  crlf?: boolean; // Line ending preference if needed
}

// Frontend Frameworks
export enum FrontendFramework {
  REACT = 'react',
  NEXTJS = 'nextjs',
  VUE = 'vue',
  NUXTJS = 'nuxtjs',
  ANGULAR = 'angular',
  SVELTE = 'svelte',
  SVELTEKIT = 'sveltekit',
  REMIX = 'remix',
  ASTRO = 'astro',
  FLUTTER = 'flutter',
  REACT_NATIVE = 'react-native',
  NONE = 'none',
}

// Backend Frameworks
export enum BackendFramework {
  NODE = 'node',
  NESTJS = 'nestjs',
  EXPRESS = 'express',
  FASTIFY = 'fastify',
  PYTHON = 'python',
  FASTAPI = 'fastapi',
  DJANGO = 'django',
  FLASK = 'flask',
  ASPNET_CORE = 'aspnet-core',
  SPRING_BOOT = 'spring-boot',
  GO = 'go',
  GIN = 'gin',
  RUST = 'rust',
  ELIXIR = 'elixir',
  NONE = 'none',
}

// Smart Contract Frameworks
export enum SmartContractFramework {
  SCRYPTO = 'scrypto',
  SOLIDITY = 'solidity',
  MOVE = 'move',
  ANCHOR = 'anchor',
  INK = 'ink',
  NONE = 'none',
}

// Mobile Frameworks (subset also in Frontend)
export enum MobileFramework {
  FLUTTER = 'flutter',
  REACT_NATIVE = 'react-native',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  NONE = 'none',
}

// Architecture Types
export enum ArchitectureType {
  HEXAGONAL = 'hexagonal',
  CLEAN = 'clean',
  MVC = 'mvc',
  FEATURE_SLICED = 'feature-sliced',
  VERTICAL_SLICE = 'vertical-slice',
  LAYERED = 'layered',
  MICROSERVICES = 'microservices',
  NONE = 'none',
}

// Rigor Modes
export enum RigorMode {
  STRICT = 'strict',
  STANDARD = 'standard',
  PROTOTYPE = 'prototype',
  LEGACY = 'legacy',
}

// Version Control Platforms
export enum VersionControlPlatform {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  AZURE_DEVOPS = 'azure-devops',
  BITBUCKET = 'bitbucket',
  NONE = 'none',
}

// Branching Strategies
export enum BranchingStrategy {
  GITFLOW = 'gitflow',
  GITHUB_FLOW = 'github-flow',
  TRUNK_BASED = 'trunk-based',
  GITLAB_FLOW = 'gitlab-flow',
  CUSTOM = 'custom',
}

// Commit Conventions
export enum CommitConvention {
  CONVENTIONAL = 'conventional',
  GITMOJI = 'gitmoji',
  ANGULAR = 'angular',
  SEMANTIC = 'semantic',
  CUSTOM = 'custom',
  NONE = 'none',
}

// Package Managers
export enum PackageManager {
  NPM = 'npm',
  YARN = 'yarn',
  PNPM = 'pnpm',
  BUN = 'bun',
  PIP = 'pip',
  POETRY = 'poetry',
  UV = 'uv',
  CARGO = 'cargo',
  NUGET = 'nuget',
  MAVEN = 'maven',
  GRADLE = 'gradle',
  GO_MODULES = 'go-modules',
  NONE = 'none',
}

// Database Types
export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MARIADB = 'mariadb',
  SQLSERVER = 'sqlserver',
  ORACLE = 'oracle',
  MONGODB = 'mongodb',
  SQLITE = 'sqlite',
  SUPABASE = 'supabase',
  FIREBASE = 'firebase',
  DYNAMODB = 'dynamodb',
  REDIS = 'redis',
  CASSANDRA = 'cassandra',
  COCKROACHDB = 'cockroachdb',
  PLANETSCALE = 'planetscale',
  NEON = 'neon',
  NONE = 'none',
}

// ORM/ODM Types
export enum OrmType {
  TYPEORM = 'typeorm',
  PRISMA = 'prisma',
  MIKROORM = 'mikroorm',
  DRIZZLE = 'drizzle',
  SEQUELIZE = 'sequelize',
  KNEX = 'knex',
  MONGOOSE = 'mongoose',
  SQLALCHEMY = 'sqlalchemy',
  DJANGO_ORM = 'django-orm',
  ENTITY_FRAMEWORK = 'entity-framework',
  DAPPER = 'dapper',
  GORM = 'gorm',
  DIESEL = 'diesel',
  ECTO = 'ecto',
  NONE = 'none',
}

// Testing Frameworks
export enum TestingFramework {
  JEST = 'jest',
  VITEST = 'vitest',
  MOCHA = 'mocha',
  PLAYWRIGHT = 'playwright',
  CYPRESS = 'cypress',
  TESTING_LIBRARY = 'testing-library',
  PYTEST = 'pytest',
  UNITTEST = 'unittest',
  XUNIT = 'xunit',
  NUNIT = 'nunit',
  JUNIT = 'junit',
  GO_TEST = 'go-test',
  RUST_TEST = 'rust-test',
  EXUNIT = 'exunit',
  NONE = 'none',
}

// Coverage Targets
export enum CoverageTarget {
  FULL = '100',
  HIGH = '80',
  STANDARD = '60',
  MINIMAL = '40',
  NONE = 'none',
}

// Deployment Platforms
export enum DeploymentPlatform {
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
  AWS = 'aws',
  AZURE = 'azure',
  GCP = 'gcp',
  RAILWAY = 'railway',
  RENDER = 'render',
  FLY_IO = 'fly-io',
  HEROKU = 'heroku',
  CLOUDFLARE = 'cloudflare',
  DOCKER = 'docker',
  KUBERNETES = 'kubernetes',
  VPS = 'vps',
  SELF_HOSTED = 'self-hosted',
  NONE = 'none',
}

// Containerization
export enum Containerization {
  DOCKER = 'docker',
  DOCKER_COMPOSE = 'docker-compose',
  KUBERNETES = 'kubernetes',
  PODMAN = 'podman',
  NONE = 'none',
}

// Security Scanning Tools
export enum SecurityScanningTool {
  SNYK = 'snyk',
  DEPENDABOT = 'dependabot',
  RENOVATE = 'renovate',
  NPM_AUDIT = 'npm-audit',
  TRIVY = 'trivy',
  SONARQUBE = 'sonarqube',
  CODEQL = 'codeql',
  NONE = 'none',
}

// Monorepo Tools
export enum MonorepoTool {
  TURBOREPO = 'turborepo',
  NX = 'nx',
  LERNA = 'lerna',
  RUSH = 'rush',
  PNPM_WORKSPACES = 'pnpm-workspaces',
  YARN_WORKSPACES = 'yarn-workspaces',
  NONE = 'none',
}

// Documentation Style
export enum DocumentationStyle {
  JSDOC = 'jsdoc',
  TSDOC = 'tsdoc',
  OPENAPI = 'openapi',
  ADR = 'adr',
  MARKDOWN = 'markdown',
  NONE = 'none',
}

// Linting Tools
export enum LintingTool {
  ESLINT = 'eslint',
  BIOME = 'biome',
  PRETTIER = 'prettier',
  OXLINT = 'oxlint',
  RUFF = 'ruff',
  BLACK = 'black',
  RUSTFMT = 'rustfmt',
  GOFMT = 'gofmt',
  CREDO = 'credo',
  NONE = 'none',
}

// IDE Integration Options
export enum IdeIntegration {
  CURSOR = 'cursor',
  WINDSURF = 'windsurf',
  GEMINI = 'gemini',
  ANTIGRAVITY = 'antigravity',
  COPILOT = 'copilot',
  CODY = 'cody',
}

// Extended Tech Stack
export interface TechStack {
  frontend: FrontendFramework;
  backend: BackendFramework;
  mobile?: MobileFramework;
  smartContract?: SmartContractFramework;
  database?: DatabaseType;
  orm?: OrmType;
  testingFramework?: TestingFramework;
  packageManager?: PackageManager;
}

// Extended Project Configuration
export interface ProjectConfig {
  versionControl?: VersionControlPlatform;
  branchingStrategy?: BranchingStrategy;
  commitConvention?: CommitConvention;
  packageManager?: PackageManager;
  coverageTarget?: CoverageTarget;
  deploymentPlatform?: DeploymentPlatform;
  containerization?: Containerization;
  securityScanning?: SecurityScanningTool[];
  monorepoTool?: MonorepoTool;
  documentationStyle?: DocumentationStyle;
  lintingTools?: LintingTool[];
  ideIntegrations?: IdeIntegration[];
}
