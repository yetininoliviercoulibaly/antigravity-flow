import { InitCommand } from '../../src/commands/init';
import { WorkflowGenerator, PipelineGenerator } from '../../src/core';
import { ILogger, ILocalizationService } from '../../src/core/interfaces';
import inquirer from 'inquirer';
import {
  ArchitectureType,
  BackendFramework,
  FrontendFramework,
  OrmType,
  RigorMode,
  WorkflowRole,
  DatabaseType,
  VersionControlPlatform,
  DeploymentPlatform,
  PackageManager,
  TestingFramework,
  IdeIntegration,
  MonorepoTool,
} from '../../src/core/types';
import { ConfigService } from '../../src/core/ConfigService';
import { StackDetector } from '../../src/core/StackDetector';

jest.mock('inquirer');

describe('InitCommand - Config Mode', () => {
  let initCommand: InitCommand;
  let mockWorkflowGenerator: any;
  let mockLogger: any;
  let mockLocalizationService: any;
  let mockPipelineGenerator: any;
  let mockConfigService: any;
  let mockStackDetector: any;
  let mockGitignoreGenerator: any;
  let mockDockerfileGenerator: any;
  let mockFileSystem: any;

  beforeEach(() => {
    mockWorkflowGenerator = {
      generateWorkflows: jest.fn(),
      generateProjectContext: jest.fn(),
    };
    mockLogger = {
      info: jest.fn(),
      success: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
    mockLocalizationService = {
      setLanguage: jest.fn(),
      getLanguage: jest.fn(),
      translate: jest.fn((key) => key),
    };
    mockPipelineGenerator = {
      generatePipeline: jest.fn(),
    };
    mockConfigService = {
      saveConfig: jest.fn(),
      loadConfig: jest.fn(),
    };
    mockStackDetector = {
      detectStack: jest.fn().mockResolvedValue({}),
    };
    mockGitignoreGenerator = {
        generate: jest.fn().mockResolvedValue(undefined),
    };
    mockDockerfileGenerator = {
        generate: jest.fn().mockResolvedValue(undefined),
    };
    mockFileSystem = {
      exists: jest.fn().mockResolvedValue(false),
      readFile: jest.fn().mockResolvedValue(''),
      writeFile: jest.fn(),
      createDirectory: jest.fn(),
    };

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

  it('should load configuration from file and skip prompts', async () => {
      const configPath = 'my-config.json';
      const mockConfig = {
        language: 'fr',
        rootPath: '/test/path',
        workflowDirectory: '.agent/workflows',
        rulesDirectory: '.agent/rules',
        techStack: {
          frontend: FrontendFramework.VUE,
          backend: BackendFramework.EXPRESS,
          database: DatabaseType.MYSQL,
          orm: OrmType.SEQUELIZE,
          testingFramework: TestingFramework.JEST,
          packageManager: PackageManager.YARN,
        },
        architecture: ArchitectureType.MVC,
        rigor: RigorMode.STANDARD,
        projectDescription: 'Configured Project',
        isMonorepo: false,
        apps: [],
        versionControl: VersionControlPlatform.GITLAB,
        deploymentPlatform: DeploymentPlatform.HEROKU,
        roles: [WorkflowRole.PRODUCT_OWNER, WorkflowRole.ARCHITECT],
        ideIntegrations: [IdeIntegration.WINDSURF],
      };

      mockFileSystem.exists.mockResolvedValue(true);
      mockFileSystem.readFile.mockResolvedValue(JSON.stringify(mockConfig));

      await initCommand.execute({ config: configPath });

      // Should not prompt
      expect(inquirer.prompt).not.toHaveBeenCalled();

      // Should set language
      expect(mockLocalizationService.setLanguage).toHaveBeenCalledWith('fr');

      // Should generate files with config details
      expect(mockWorkflowGenerator.generateWorkflows).toHaveBeenCalledWith(
        expect.objectContaining({
          projectDescription: 'Configured Project',
          architecture: ArchitectureType.MVC,
        }),
        expect.arrayContaining([WorkflowRole.PRODUCT_OWNER, WorkflowRole.ARCHITECT])
      );

      // Should integrate IDE
      expect(mockFileSystem.writeFile).toHaveBeenCalledWith(
          expect.stringContaining('.windsurfrules'),
          expect.anything()
      );
    });

    it('should handle missing config file gracefully', async () => {
      mockFileSystem.exists.mockResolvedValue(false);
      
      await initCommand.execute({ config: 'missing.json' });

      expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('not found'));
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(mockWorkflowGenerator.generateWorkflows).not.toHaveBeenCalled();
    });
});
