import {
  ArchitectureType,
  TechStack,
  RigorMode,
  VersionControlPlatform,
  BranchingStrategy,
  CommitConvention,
  PackageManager,
  CoverageTarget,
  DeploymentPlatform,
  Containerization,
  SecurityScanningTool,
  MonorepoTool,
  DocumentationStyle,
  LintingTool,
  IdeIntegration,
  WorkflowRole,
} from './types';

export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

export interface IFileSystem {
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
}

export interface ITemplateProvider {
  getTemplate(templateName: string): Promise<string>;
  render(templateContent: string, data: Record<string, any>): string;
}

export interface IProjectDetails {
  // Core paths
  rootPath: string;
  workflowDirectory: string;
  rulesDirectory?: string;

  // Commands
  buildCommand: string;
  testCommand: string;
  lintCommand?: string;
  formatCommand?: string;

  // Tech stack
  techStack: TechStack;
  architecture: ArchitectureType;
  rigor: RigorMode;

  // Project info
  projectDescription?: string;
  projectName?: string;
  language?: string; // 'en' | 'fr'

  // Monorepo
  isMonorepo?: boolean;
  apps?: string[];
  monorepoTool?: MonorepoTool;

  // Version control
  versionControl?: VersionControlPlatform;
  branchingStrategy?: BranchingStrategy;
  commitConvention?: CommitConvention;

  // Development tools
  packageManager?: PackageManager;
  lintingTools?: LintingTool[];
  documentationStyle?: DocumentationStyle;

  // Testing
  coverageTarget?: CoverageTarget;

  // Deployment
  deploymentPlatform?: DeploymentPlatform;
  containerization?: Containerization;
  environments?: string[]; // e.g., ['development', 'staging', 'production']

  // Security
  securityScanning?: SecurityScanningTool[];

  // IDE Integrations
  ideIntegrations?: IdeIntegration[];

  // Advanced options (conditional)
  prApprovalsRequired?: number; // for rigor=strict
  preCommitHooks?: boolean;
  blockMergeOnFailingChecks?: boolean;
  interfacePrefix?: string; // for hexagonal architecture
  repositoryPattern?: 'repository' | 'dao' | 'active-record';

  // Roles
  roles?: WorkflowRole[];
}

export interface ILocalizationService {
  setLanguage(lang: string): void;
  getLanguage(): string;
  translate(key: string, args?: Record<string, string>): string;
}

export interface IRulesComposer {
  composeRules(stack: TechStack, rigor: RigorMode): Promise<string>;
}

export interface IPipelineGenerator {
  generatePipeline(projectDetails: IProjectDetails): Promise<void>;
}

export interface IContextGenerator {
  generateContext(project: IProjectDetails): Promise<string>;
}

export interface IGitignoreGenerator {
  generate(projectRoot: string, techStack: TechStack): Promise<void>;
}

export interface IDockerfileGenerator {
  generate(projectRoot: string, techStack: TechStack): Promise<void>;
}
