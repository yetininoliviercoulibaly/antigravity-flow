import { InitCommand } from '../../src/commands/init';
import { WorkflowGenerator, PipelineGenerator } from '../../src/core';
import { ILogger, ILocalizationService } from '../../src/core/interfaces';
import inquirer from 'inquirer';
import {
  ArchitectureType,
  BackendFramework,
  FrontendFramework,
  SmartContractFramework,
  RigorMode,
  WorkflowRole,
  DatabaseType,
  OrmType,
  VersionControlPlatform,
  BranchingStrategy,
  CommitConvention,
  PackageManager,
  TestingFramework,
  CoverageTarget,
  DeploymentPlatform,
  Containerization,
  SecurityScanningTool,
  MonorepoTool,
  IdeIntegration,
} from '../../src/core/types';
import { ConfigService } from '../../src/core/ConfigService';
import { StackDetector } from '../../src/core/StackDetector';

jest.mock('inquirer');

describe('InitCommand', () => {
  let initCommand: InitCommand;
  let mockWorkflowGenerator: jest.Mocked<WorkflowGenerator>;
  let mockLogger: jest.Mocked<ILogger>;
  let mockLocalizationService: jest.Mocked<ILocalizationService>;
  let mockPipelineGenerator: jest.Mocked<PipelineGenerator>;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockStackDetector: jest.Mocked<StackDetector>;
  let mockGitignoreGenerator: any;
  let mockDockerfileGenerator: any;
  let mockFileSystem: any;

  // Helper to create mock answers for all prompt sections
  const createMockAnswers = (overrides: Partial<any> = {}) => {
    const defaults = {
      // Language
      language: 'en',
      // Core
      projectDescription: 'Test project',
      frontend: FrontendFramework.REACT,
      backend: BackendFramework.NESTJS,
      smartContract: SmartContractFramework.NONE,
      database: DatabaseType.POSTGRESQL,
      orm: OrmType.PRISMA,
      architecture: ArchitectureType.HEXAGONAL,
      rigor: RigorMode.STRICT,
      // VCS
      versionControl: VersionControlPlatform.GITHUB,
      branchingStrategy: BranchingStrategy.GITHUB_FLOW,
      commitConvention: CommitConvention.CONVENTIONAL,
      // Tooling
      packageManager: PackageManager.NPM,
      testingFramework: TestingFramework.JEST,
      coverageTarget: CoverageTarget.FULL,
      // Monorepo
      isMonorepo: false,
      monorepoTool: MonorepoTool.NONE,
      apps: [],
      // Deployment
      deploymentPlatform: DeploymentPlatform.VERCEL,
      containerization: Containerization.NONE,
      securityScanning: [SecurityScanningTool.DEPENDABOT],
      // Commands
      buildCommand: 'npm run build',
      testCommand: 'npm test',
      // Strict mode conditionals
      prApprovalsRequired: 2,
      preCommitHooks: true,
      blockMergeOnFailingChecks: true,
      // Hexagonal conditionals
      interfacePrefix: 'I',
      repositoryPattern: 'repository',
      // Final
      roles: [WorkflowRole.DEVELOPER, WorkflowRole.QA],
      ideIntegration: [],
      confirm: true,
    };
    return { ...defaults, ...overrides };
  };

  beforeEach(() => {
    mockWorkflowGenerator = {
      generateWorkflows: jest.fn(),
      generateProjectContext: jest.fn(),
    } as any;
    mockLogger = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as any;
    mockLocalizationService = {
      setLanguage: jest.fn(),
      getLanguage: jest.fn(),
      translate: jest.fn((key) => key),
    } as any;
    mockPipelineGenerator = {
      generatePipeline: jest.fn(),
    } as any;
    mockConfigService = {
      saveConfig: jest.fn(),
      loadConfig: jest.fn(),
    } as any;
    mockStackDetector = {
      detectStack: jest.fn().mockResolvedValue({}),
    } as any;
    mockGitignoreGenerator = {
      generate: jest.fn().mockResolvedValue(undefined),
    } as any;
     mockDockerfileGenerator = {
      generate: jest.fn().mockResolvedValue(undefined),
    } as any;
    mockFileSystem = {
      exists: jest.fn().mockResolvedValue(false),
      readFile: jest.fn().mockResolvedValue('Rule content'),
      writeFile: jest.fn(),
      createDirectory: jest.fn(),
    } as any;

    initCommand = new InitCommand(
      mockWorkflowGenerator,
      mockLogger,
      mockLocalizationService,
      mockPipelineGenerator,
      mockConfigService,
      mockStackDetector,
      mockGitignoreGenerator,
      mockDockerfileGenerator,
      mockFileSystem,
    );
  });

  describe('Basic Execution', () => {
    it('should execute successfully with default configuration', async () => {
      const answers = createMockAnswers();
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockLocalizationService.setLanguage).toHaveBeenCalledWith('en');
      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalled();
      expect(mockWorkflowGenerator.generateProjectContext).toHaveBeenCalled();
      expect(mockPipelineGenerator.generatePipeline).toHaveBeenCalled();
      expect(mockConfigService.saveConfig).toHaveBeenCalled();
      expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('prompts.success'));
    });

    it('should cancel when user does not confirm', async () => {
      const answers = createMockAnswers({ confirm: false });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockLogger.warn).toHaveBeenCalledWith('prompts.cancelled');
      expect(mockWorkflowGenerator.generateWorkflows).not.toHaveBeenCalled();
    });

    it('should log error on failure', async () => {
      (inquirer.prompt as unknown as jest.Mock).mockRejectedValue(new Error('Test Error'));

      await initCommand.execute();

      expect(mockLogger.error).toHaveBeenCalledWith('prompts.failed');
    });
  });

  describe('New Roles', () => {
    it('should support DevOps role', async () => {
      const answers = createMockAnswers({ roles: [WorkflowRole.DEVOPS] });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([WorkflowRole.DEVOPS]),
      );
    });

    it('should support Security Engineer role', async () => {
      const answers = createMockAnswers({ roles: [WorkflowRole.SECURITY] });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([WorkflowRole.SECURITY]),
      );
    });

    it('should support Tech Writer role', async () => {
      const answers = createMockAnswers({ roles: [WorkflowRole.TECH_WRITER] });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([WorkflowRole.TECH_WRITER]),
      );
    });

    it('should support Data Engineer role', async () => {
      const answers = createMockAnswers({ roles: [WorkflowRole.DATA_ENGINEER] });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([WorkflowRole.DATA_ENGINEER]),
      );
    });

    it('should support multiple new roles together', async () => {
      const allNewRoles = [
        WorkflowRole.DEVOPS,
        WorkflowRole.SECURITY,
        WorkflowRole.TECH_WRITER,
        WorkflowRole.DATA_ENGINEER,
      ];
      const answers = createMockAnswers({ roles: allNewRoles });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining(allNewRoles),
      );
    });
  });

  describe('Database Configuration', () => {
    it('should support PostgreSQL database', async () => {
      const answers = createMockAnswers({
        database: DatabaseType.POSTGRESQL,
        orm: OrmType.PRISMA,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            database: DatabaseType.POSTGRESQL,
            orm: OrmType.PRISMA,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support SQL Server database', async () => {
      const answers = createMockAnswers({
        database: DatabaseType.SQLSERVER,
        orm: OrmType.ENTITY_FRAMEWORK,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            database: DatabaseType.SQLSERVER,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support Oracle database', async () => {
      const answers = createMockAnswers({
        database: DatabaseType.ORACLE,
        orm: OrmType.TYPEORM,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            database: DatabaseType.ORACLE,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support MongoDB with Mongoose', async () => {
      const answers = createMockAnswers({
        database: DatabaseType.MONGODB,
        orm: OrmType.MONGOOSE,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            database: DatabaseType.MONGODB,
            orm: OrmType.MONGOOSE,
          }),
        }),
        expect.anything(),
      );
    });
  });

  describe('Framework Configuration', () => {
    it('should support Next.js frontend', async () => {
      const answers = createMockAnswers({ frontend: FrontendFramework.NEXTJS });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            frontend: FrontendFramework.NEXTJS,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support FastAPI backend', async () => {
      const answers = createMockAnswers({
        backend: BackendFramework.FASTAPI,
        packageManager: PackageManager.POETRY,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            backend: BackendFramework.FASTAPI,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support Spring Boot backend', async () => {
      const answers = createMockAnswers({
        backend: BackendFramework.SPRING_BOOT,
        packageManager: PackageManager.MAVEN,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            backend: BackendFramework.SPRING_BOOT,
          }),
        }),
        expect.anything(),
      );
    });

    it('should support Solidity smart contracts', async () => {
      const answers = createMockAnswers({
        smartContract: SmartContractFramework.SOLIDITY,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          techStack: expect.objectContaining({
            smartContract: SmartContractFramework.SOLIDITY,
          }),
        }),
        expect.anything(),
      );
    });
  });

  describe('Version Control Configuration', () => {
    it('should configure GitHub with GitHub Flow', async () => {
      const answers = createMockAnswers({
        versionControl: VersionControlPlatform.GITHUB,
        branchingStrategy: BranchingStrategy.GITHUB_FLOW,
        commitConvention: CommitConvention.CONVENTIONAL,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          versionControl: VersionControlPlatform.GITHUB,
          branchingStrategy: BranchingStrategy.GITHUB_FLOW,
          commitConvention: CommitConvention.CONVENTIONAL,
        }),
      );
    });

    it('should configure GitLab with GitFlow', async () => {
      const answers = createMockAnswers({
        versionControl: VersionControlPlatform.GITLAB,
        branchingStrategy: BranchingStrategy.GITFLOW,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          versionControl: VersionControlPlatform.GITLAB,
          branchingStrategy: BranchingStrategy.GITFLOW,
        }),
      );
    });

    it('should support Azure DevOps', async () => {
      const answers = createMockAnswers({
        versionControl: VersionControlPlatform.AZURE_DEVOPS,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          versionControl: VersionControlPlatform.AZURE_DEVOPS,
        }),
      );
    });
  });

  describe('Deployment Configuration', () => {
    it('should configure Vercel deployment', async () => {
      const answers = createMockAnswers({
        deploymentPlatform: DeploymentPlatform.VERCEL,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          deploymentPlatform: DeploymentPlatform.VERCEL,
        }),
      );
    });

    it('should configure Docker with Kubernetes', async () => {
      const answers = createMockAnswers({
        deploymentPlatform: DeploymentPlatform.AWS,
        containerization: Containerization.KUBERNETES,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          deploymentPlatform: DeploymentPlatform.AWS,
          containerization: Containerization.KUBERNETES,
        }),
      );
    });

    it('should configure security scanning tools', async () => {
      const answers = createMockAnswers({
        securityScanning: [SecurityScanningTool.SNYK, SecurityScanningTool.SONARQUBE],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          securityScanning: expect.arrayContaining([
            SecurityScanningTool.SNYK,
            SecurityScanningTool.SONARQUBE,
          ]),
        }),
      );
    });
  });

  describe('Monorepo Configuration', () => {
    it('should configure Turborepo for monorepo', async () => {
      const answers = createMockAnswers({
        isMonorepo: true,
        monorepoTool: MonorepoTool.TURBOREPO,
        apps: ['api', 'web', 'mobile'],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          isMonorepo: true,
          monorepoTool: MonorepoTool.TURBOREPO,
          apps: ['api', 'web', 'mobile'],
        }),
        expect.anything(),
      );
    });

    it('should configure Nx for monorepo', async () => {
      const answers = createMockAnswers({
        isMonorepo: true,
        monorepoTool: MonorepoTool.NX,
        apps: ['backend', 'frontend'],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          monorepoTool: MonorepoTool.NX,
        }),
        expect.anything(),
      );
    });
  });

  describe('IDE Integration', () => {
    it('should configure Cursor integration', async () => {
      const answers = createMockAnswers({
        roles: [WorkflowRole.DEVELOPER],
        ideIntegration: [IdeIntegration.CURSOR],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);
      mockFileSystem.exists.mockResolvedValue(true);

      await initCommand.execute();

      expect(mockLogger.success).toHaveBeenCalledWith(
        expect.stringContaining('Cursor'),
      );
      expect(mockFileSystem.writeFile).toHaveBeenCalled();
    });

    it('should configure Gemini Code Assist integration', async () => {
      const answers = createMockAnswers({
        ideIntegration: [IdeIntegration.GEMINI],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockLogger.success).toHaveBeenCalledWith(
        expect.stringContaining('Gemini Code Assist'),
      );
      expect(mockFileSystem.writeFile).toHaveBeenCalled();
    });

    it('should configure multiple IDE integrations', async () => {
      const answers = createMockAnswers({
        roles: [WorkflowRole.DEVELOPER],
        ideIntegration: [IdeIntegration.CURSOR, IdeIntegration.WINDSURF, IdeIntegration.GEMINI],
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);
      mockFileSystem.exists.mockResolvedValue(true);

      await initCommand.execute();

      expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('Cursor'));
      expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('Windsurf'));
      expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('Gemini'));
    });
  });

  describe('Rigor Modes', () => {
    it('should configure strict mode with all options', async () => {
      const answers = createMockAnswers({
        rigor: RigorMode.STRICT,
        prApprovalsRequired: 2,
        preCommitHooks: true,
        blockMergeOnFailingChecks: true,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          rigor: RigorMode.STRICT,
          prApprovalsRequired: 2,
          preCommitHooks: true,
          blockMergeOnFailingChecks: true,
        }),
      );
    });

    it('should support standard rigor mode', async () => {
      const answers = createMockAnswers({
        rigor: RigorMode.STANDARD,
        coverageTarget: CoverageTarget.HIGH,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          rigor: RigorMode.STANDARD,
        }),
        expect.anything(),
      );
    });

    it('should support prototype rigor mode', async () => {
      const answers = createMockAnswers({
        rigor: RigorMode.PROTOTYPE,
        coverageTarget: CoverageTarget.MINIMAL,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          rigor: RigorMode.PROTOTYPE,
        }),
        expect.anything(),
      );
    });

    it('should support legacy rigor mode', async () => {
      const answers = createMockAnswers({ rigor: RigorMode.LEGACY });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          rigor: RigorMode.LEGACY,
        }),
        expect.anything(),
      );
    });
  });

  describe('Architecture Configuration', () => {
    it('should configure hexagonal architecture with interface prefix', async () => {
      const answers = createMockAnswers({
        architecture: ArchitectureType.HEXAGONAL,
        interfacePrefix: 'I',
        repositoryPattern: 'repository',
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          architecture: ArchitectureType.HEXAGONAL,
          interfacePrefix: 'I',
          repositoryPattern: 'repository',
        }),
      );
    });

    it('should configure clean architecture', async () => {
      const answers = createMockAnswers({
        architecture: ArchitectureType.CLEAN,
        interfacePrefix: '',
        repositoryPattern: 'dao',
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          architecture: ArchitectureType.CLEAN,
        }),
        expect.anything(),
      );
    });

    it('should configure microservices architecture', async () => {
      const answers = createMockAnswers({
        architecture: ArchitectureType.MICROSERVICES,
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          architecture: ArchitectureType.MICROSERVICES,
        }),
        expect.anything(),
      );
    });
  });

  describe('Package Manager Support', () => {
    it('should use correct defaults for pnpm', async () => {
      const answers = createMockAnswers({
        packageManager: PackageManager.PNPM,
        buildCommand: 'pnpm build',
        testCommand: 'pnpm test',
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          packageManager: PackageManager.PNPM,
          buildCommand: 'pnpm build',
          testCommand: 'pnpm test',
        }),
      );
    });

    it('should use correct defaults for cargo (Rust)', async () => {
      const answers = createMockAnswers({
        backend: BackendFramework.RUST,
        packageManager: PackageManager.CARGO,
        buildCommand: 'cargo build',
        testCommand: 'cargo test',
      });
      (inquirer.prompt as unknown as jest.Mock).mockResolvedValue(answers);

      await initCommand.execute();

      expect(mockConfigService.saveConfig).toHaveBeenCalledWith(
        expect.objectContaining({
          packageManager: PackageManager.CARGO,
        }),
      );
    });
  });
});
