export enum WorkflowRole {
  DEVELOPER = 'dev',
  QA = 'qa',
  LEAD_DEV = 'lead',
  ARCHITECT = 'architect',
  PRODUCT_OWNER = 'po',
  BUSINESS_ANALYST = 'ba',
  RULES = 'rules',
}

export const WORKFLOW_FILES = {
  [WorkflowRole.DEVELOPER]: 'dev.md',
  [WorkflowRole.QA]: 'qa.md',
  [WorkflowRole.LEAD_DEV]: 'lead.md',
  [WorkflowRole.ARCHITECT]: 'architect.md',
  [WorkflowRole.PRODUCT_OWNER]: 'po.md',
  [WorkflowRole.BUSINESS_ANALYST]: 'ba.md',
  [WorkflowRole.RULES]: 'coding-standards.md',
};

export interface WorkflowConfig {
  crlf?: boolean; // Line ending preference if needed
}

export enum FrontendFramework {
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  FLUTTER = 'flutter',
  NONE = 'none',
}

export enum BackendFramework {
  NODE = 'node',
  NESTJS = 'nestjs',
  PYTHON = 'python',
  ASPNET_CORE = 'aspnet-core',
  NONE = 'none',
}

export enum ArchitectureType {
  HEXAGONAL = 'hexagonal',
  MVC = 'mvc',
  FEATURE_SLICED = 'feature-sliced',
}

export enum RigorMode {
  STRICT = 'strict',
  PROTOTYPE = 'prototype',
}

export interface TechStack {
  frontend: FrontendFramework;
  backend: BackendFramework;
}
