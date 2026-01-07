import inquirer from 'inquirer';
import * as path from 'path';
import { WorkflowGenerator } from '../core/WorkflowGenerator';
import {
  WorkflowRole,
  FrontendFramework,
  BackendFramework,
  SmartContractFramework,
  ArchitectureType,
  RigorMode,
  VersionControlPlatform,
  BranchingStrategy,
  CommitConvention,
  PackageManager,
  DatabaseType,
  OrmType,
  TestingFramework,
  CoverageTarget,
  DeploymentPlatform,
  Containerization,
  SecurityScanningTool,
  MonorepoTool,
  IdeIntegration,
  TechStack,
} from '../core/types';
import { ILogger, ILocalizationService, IPipelineGenerator, IFileSystem, IProjectDetails, IGitignoreGenerator, IDockerfileGenerator } from '../core/interfaces';
import { IConfigService } from '../core/ConfigService';
import { IStackDetector } from '../core/StackDetector';

export class InitCommand {
  constructor(
    private workflowGenerator: WorkflowGenerator,
    private logger: ILogger,
    private localizationService: ILocalizationService,
    private pipelineGenerator: IPipelineGenerator,
    private configService: IConfigService,
    private stackDetector: IStackDetector,
    private gitignoreGenerator: IGitignoreGenerator,
    private dockerfileGenerator: IDockerfileGenerator,
    private fileSystem: IFileSystem,
  ) {}

  async execute(options: { config?: string } = {}): Promise<void> {
    try {
      if (options.config) {
        await this.executeWithConfig(options.config);
        return;
      }
      const language = await this.promptLanguage();
      this.localizationService.setLanguage(language);

      this.showWelcome();
      const projectRoot = process.cwd();
      const detectedStack = await this.detectStack(projectRoot);

      const coreAnswers = await this.promptCoreQuestions(detectedStack);
      const vcsAnswers = await this.promptVersionControlQuestions();
      const toolingAnswers = await this.promptToolingQuestions(coreAnswers.rigor);
      const monorerepoAnswers = await this.promptMonorepoQuestions();
      const deploymentAnswers = await this.promptDeploymentQuestions();
      const commandAnswers = await this.promptCommandQuestions(toolingAnswers.packageManager);
      const strictModeAnswers = await this.promptStrictModeQuestions(coreAnswers.rigor);
      const hexagonalAnswers = await this.promptHexagonalQuestions(coreAnswers.architecture);
      
      const finalAnswers = await this.promptFinalQuestions();

      if (!finalAnswers.confirm) {
        this.logger.warn(this.localizationService.translate('prompts.cancelled'));
        return;
      }

      const projectDetails = this.buildProjectDetails(
        projectRoot,
        language,
        detectedStack,
        coreAnswers,
        vcsAnswers,
        toolingAnswers,
        monorerepoAnswers,
        deploymentAnswers,
        commandAnswers,
        strictModeAnswers,
        hexagonalAnswers,
        finalAnswers.ideIntegration,
        finalAnswers.roles
      );

      await this.generateFiles(projectDetails, finalAnswers.roles);
      await this.integrateWithIde(projectDetails, finalAnswers.ideIntegration, finalAnswers.roles);

      this.logger.success(this.localizationService.translate('prompts.success'));
    } catch (error) {
      this.logger.error(this.localizationService.translate('prompts.failed'));
    }
  }

  private async promptLanguage(): Promise<string> {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Select language / Choisissez votre langue',
        choices: ['en', 'fr'],
        default: 'en',
      },
    ]);
    return answer.language;
  }

  private showWelcome(): void {
    this.logger.info(this.localizationService.translate('prompts.welcome'));
    this.logger.info(this.localizationService.translate('prompts.intro'));
  }

  private async detectStack(projectRoot: string): Promise<any> {
    this.logger.info('Auto-detecting project stack...');
    const detectedStack = await this.stackDetector.detectStack(projectRoot);
    if (Object.keys(detectedStack).length > 0) {
      this.logger.success(`Detected: ${JSON.stringify(detectedStack)}`);
    } else {
      this.logger.info('No specific stack detected. Falling back to defaults.');
    }
    return detectedStack;
  }

  private async promptCoreQuestions(detectedStack: any): Promise<any> {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'projectDescription',
        message: this.localizationService.translate('prompts.project_description'),
        default: 'My awesome project',
      },
      {
        type: 'list',
        name: 'frontend',
        message: this.localizationService.translate('prompts.frontend'),
        choices: Object.values(FrontendFramework),
        default: detectedStack.frontend || FrontendFramework.NONE,
      },
      {
        type: 'list',
        name: 'backend',
        message: this.localizationService.translate('prompts.backend'),
        choices: Object.values(BackendFramework),
        default: detectedStack.backend || BackendFramework.NONE,
      },
      {
        type: 'list',
        name: 'smartContract',
        message: this.localizationService.translate('prompts.smart_contract'),
        choices: Object.values(SmartContractFramework),
        default: detectedStack.smartContract || SmartContractFramework.NONE,
      },
      {
        type: 'list',
        name: 'database',
        message: this.localizationService.translate('prompts.database'),
        choices: Object.values(DatabaseType),
        default: DatabaseType.NONE,
      },
      {
        type: 'list',
        name: 'orm',
        message: this.localizationService.translate('prompts.orm'),
        choices: Object.values(OrmType),
        default: OrmType.NONE,
        when: (answers) => answers.database !== DatabaseType.NONE,
      },
      {
        type: 'list',
        name: 'architecture',
        message: this.localizationService.translate('prompts.architecture'),
        choices: Object.values(ArchitectureType),
        default: ArchitectureType.HEXAGONAL,
      },
      {
        type: 'list',
        name: 'rigor',
        message: this.localizationService.translate('prompts.rigor'),
        choices: Object.values(RigorMode),
        default: RigorMode.STRICT,
      },
    ]);
  }

  private async promptVersionControlQuestions(): Promise<any> {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'versionControl',
        message: this.localizationService.translate('prompts.version_control'),
        choices: Object.values(VersionControlPlatform),
        default: VersionControlPlatform.GITHUB,
      },
      {
        type: 'list',
        name: 'branchingStrategy',
        message: this.localizationService.translate('prompts.branching_strategy'),
        choices: Object.values(BranchingStrategy),
        default: BranchingStrategy.GITHUB_FLOW,
        when: (answers) => answers.versionControl !== VersionControlPlatform.NONE,
      },
      {
        type: 'list',
        name: 'commitConvention',
        message: this.localizationService.translate('prompts.commit_convention'),
        choices: Object.values(CommitConvention),
        default: CommitConvention.CONVENTIONAL,
        when: (answers) => answers.versionControl !== VersionControlPlatform.NONE,
      },
    ]);
  }

  private async promptToolingQuestions(rigor: RigorMode): Promise<any> {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'packageManager',
        message: this.localizationService.translate('prompts.package_manager'),
        choices: Object.values(PackageManager),
        default: PackageManager.NPM,
      },
      {
        type: 'list',
        name: 'testingFramework',
        message: this.localizationService.translate('prompts.testing_framework'),
        choices: Object.values(TestingFramework),
        default: TestingFramework.JEST,
      },
      {
        type: 'list',
        name: 'coverageTarget',
        message: this.localizationService.translate('prompts.coverage_target'),
        choices: Object.values(CoverageTarget),
        default: rigor === RigorMode.STRICT ? CoverageTarget.FULL : CoverageTarget.HIGH,
      },
    ]);
  }

  private async promptMonorepoQuestions(): Promise<any> {
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'isMonorepo',
        message: this.localizationService.translate('prompts.is_monorepo'),
        default: false,
      },
      {
        type: 'list',
        name: 'monorepoTool',
        message: this.localizationService.translate('prompts.monorepo_tool'),
        choices: Object.values(MonorepoTool),
        default: MonorepoTool.TURBOREPO,
        when: (answers) => answers.isMonorepo,
      },
      {
        type: 'input',
        name: 'apps',
        message: this.localizationService.translate('prompts.monorepo_apps'),
        when: (answers) => answers.isMonorepo,
        filter: (input) =>
          input
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0),
      },
    ]);
  }

  private async promptDeploymentQuestions(): Promise<any> {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'deploymentPlatform',
        message: this.localizationService.translate('prompts.deployment_platform'),
        choices: Object.values(DeploymentPlatform),
        default: DeploymentPlatform.NONE,
      },
      {
        type: 'list',
        name: 'containerization',
        message: this.localizationService.translate('prompts.containerization'),
        choices: Object.values(Containerization),
        default: Containerization.DOCKER,
        when: (answers) =>
          answers.deploymentPlatform !== DeploymentPlatform.VERCEL &&
          answers.deploymentPlatform !== DeploymentPlatform.NETLIFY &&
          answers.deploymentPlatform !== DeploymentPlatform.NONE,
      },
      {
        type: 'checkbox',
        name: 'securityScanning',
        message: this.localizationService.translate('prompts.security_scanning'),
        choices: Object.values(SecurityScanningTool).filter((s) => s !== SecurityScanningTool.NONE),
        default: [SecurityScanningTool.DEPENDABOT],
      },
    ]);
  }

  private async promptCommandQuestions(packageManager: PackageManager): Promise<any> {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'buildCommand',
        message: this.localizationService.translate('prompts.build_command'),
        default: this.getDefaultBuildCommand(packageManager),
      },
      {
        type: 'input',
        name: 'testCommand',
        message: this.localizationService.translate('prompts.test_command'),
        default: this.getDefaultTestCommand(packageManager),
      },
    ]);
  }

  private async promptStrictModeQuestions(rigor: RigorMode): Promise<any> {
    if (rigor !== RigorMode.STRICT) return {};
    return inquirer.prompt([
      {
        type: 'number',
        name: 'prApprovalsRequired',
        message: this.localizationService.translate('prompts.pr_approvals'),
        default: 2,
      },
      {
        type: 'confirm',
        name: 'preCommitHooks',
        message: this.localizationService.translate('prompts.pre_commit_hooks'),
        default: true,
      },
      {
        type: 'confirm',
        name: 'blockMergeOnFailingChecks',
        message: this.localizationService.translate('prompts.block_merge_failing'),
        default: true,
      },
    ]);
  }

  private async promptHexagonalQuestions(architecture: ArchitectureType): Promise<any> {
    if (architecture !== ArchitectureType.HEXAGONAL && architecture !== ArchitectureType.CLEAN) return {};
    return inquirer.prompt([
      {
        type: 'input',
        name: 'interfacePrefix',
        message: this.localizationService.translate('prompts.interface_prefix'),
        default: 'I',
      },
      {
        type: 'list',
        name: 'repositoryPattern',
        message: this.localizationService.translate('prompts.repository_pattern'),
        choices: ['repository', 'dao', 'active-record'],
        default: 'repository',
      },
    ]);
  }

  private async promptFinalQuestions(): Promise<any> {
    return inquirer.prompt([
      {
        type: 'checkbox',
        name: 'roles',
        message: this.localizationService.translate('prompts.workflows_selection'),
        choices: Object.values(WorkflowRole).map((role) => ({
          name: this.localizationService.translate(`roles.${role}`),
          value: role,
        })),
        default: [WorkflowRole.DEVELOPER, WorkflowRole.QA, WorkflowRole.LEAD_DEV],
      },
      {
        type: 'checkbox',
        name: 'ideIntegration',
        message: this.localizationService.translate('prompts.ide_integration'),
        choices: [
          { name: 'Cursor (.cursor/rules)', value: IdeIntegration.CURSOR },
          { name: 'Windsurf (.windsurfrules)', value: IdeIntegration.WINDSURF },
          { name: 'Google Antigravity (.antigravity)', value: IdeIntegration.ANTIGRAVITY },
          { name: 'Gemini Code Assist (.gemini)', value: IdeIntegration.GEMINI },
          { name: 'GitHub Copilot', value: IdeIntegration.COPILOT },
        ],
        default: [],
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: this.localizationService.translate('prompts.confirm'),
        default: true,
      },
    ]);
  }

  private buildProjectDetails(
    projectRoot: string,
    language: string,
    detectedStack: any,
    coreAnswers: any,
    vcsAnswers: any,
    toolingAnswers: any,
    monorepoAnswers: any,
    deploymentAnswers: any,
    commandAnswers: any,
    strictModeAnswers: any,
    hexagonalAnswers: any,
    ideIntegrations: IdeIntegration[],
    roles: WorkflowRole[]
  ): IProjectDetails {
    return {
      rootPath: projectRoot,
      workflowDirectory: '.agent/workflows',
      rulesDirectory: '.agent/rules',
      buildCommand: commandAnswers.buildCommand,
      testCommand: commandAnswers.testCommand,
      techStack: {
        frontend: coreAnswers.frontend,
        backend: coreAnswers.backend,
        smartContract: coreAnswers.smartContract,
        database: coreAnswers.database,
        orm: coreAnswers.orm,
        testingFramework: toolingAnswers.testingFramework,
        packageManager: toolingAnswers.packageManager,
      },
      architecture: coreAnswers.architecture,
      rigor: coreAnswers.rigor,
      projectDescription: coreAnswers.projectDescription,
      isMonorepo: monorepoAnswers.isMonorepo,
      apps: monorepoAnswers.apps,
      monorepoTool: monorepoAnswers.monorepoTool,
      language: language,
      versionControl: vcsAnswers.versionControl,
      branchingStrategy: vcsAnswers.branchingStrategy,
      commitConvention: vcsAnswers.commitConvention,
      packageManager: toolingAnswers.packageManager,
      coverageTarget: toolingAnswers.coverageTarget,
      deploymentPlatform: deploymentAnswers.deploymentPlatform,
      containerization: deploymentAnswers.containerization,
      securityScanning: deploymentAnswers.securityScanning,
      ideIntegrations: ideIntegrations,
      roles: roles,
      ...strictModeAnswers,
      ...hexagonalAnswers,
    };
  }

  private async generateFiles(projectDetails: IProjectDetails, roles: WorkflowRole[]): Promise<void> {
    await this.workflowGenerator.generateWorkflows(projectDetails, roles);
    await this.workflowGenerator.generateProjectContext(projectDetails);
    await this.pipelineGenerator.generatePipeline(projectDetails);
    await this.gitignoreGenerator.generate(projectDetails.rootPath, projectDetails.techStack);
    await this.dockerfileGenerator.generate(projectDetails.rootPath, projectDetails.techStack);
    await this.configService.saveConfig(projectDetails);
  }

  private async integrateWithIde(projectDetails: IProjectDetails, ideIntegrations: IdeIntegration[], roles: WorkflowRole[]): Promise<void> {
    const rulesPath = path.join(projectDetails.rootPath, '.agent/rules/coding-standards.md');
    const rulesContent = await this.fileSystem.readFile(rulesPath);

    if (ideIntegrations.includes(IdeIntegration.CURSOR)) {
      await this.integrateCursor(projectDetails, rulesContent, roles);
    }
    if (ideIntegrations.includes(IdeIntegration.WINDSURF)) {
      await this.integrateWindsurf(projectDetails, rulesContent, roles);
    }
    if (ideIntegrations.includes(IdeIntegration.GEMINI)) {
      await this.integrateGemini(projectDetails, rulesContent);
    }
    if (ideIntegrations.includes(IdeIntegration.ANTIGRAVITY)) {
      await this.integrateAntigravity(projectDetails, rulesContent);
    }
    // Future: Copilot, Cody integrations
  }

  private async integrateAntigravity(projectDetails: IProjectDetails, rulesContent: string): Promise<void> {
      const antigravityPath = path.join(projectDetails.rootPath, '.antigravity/rules.md');
      await this.fileSystem.createDirectory(path.dirname(antigravityPath));
      await this.fileSystem.writeFile(antigravityPath, rulesContent);
      this.logger.success('Integrated with Google Antigravity (.antigravity/rules.md)');
  }

  private async integrateCursor(projectDetails: IProjectDetails, rulesContent: string, roles: WorkflowRole[]): Promise<void> {
    // 1. Base Rules
    const cursorPath = path.join(projectDetails.rootPath, '.cursor/rules/antigravity.mdc');
    await this.fileSystem.createDirectory(path.dirname(cursorPath));
    await this.fileSystem.writeFile(cursorPath, rulesContent);
    this.logger.success('Integrated with Cursor (.cursor/rules/antigravity.mdc)');

    // 2. Roles
    for (const role of roles) {
      const roleFileName = `${role.toLowerCase()}.md`;
      const sourcePath = path.join(projectDetails.rootPath, projectDetails.workflowDirectory, roleFileName);
      
      if (await this.fileSystem.exists(sourcePath)) {
        const ruleContent = await this.fileSystem.readFile(sourcePath);
        const mdcContent = `---
description: Act as a ${role}
globs: **/*
---
${ruleContent}`;
        const rolePath = path.join(projectDetails.rootPath, '.cursor/rules', `${role.toLowerCase()}.mdc`);
        await this.fileSystem.writeFile(rolePath, mdcContent);
      }
    }
    this.logger.success('Integrated Roles with Cursor (.cursor/rules/*.mdc)');
  }

  private async integrateWindsurf(projectDetails: IProjectDetails, rulesContent: string, roles: WorkflowRole[]): Promise<void> {
    // 1. Base Rules (.windsurfrules)
    const windsurfPath = path.join(projectDetails.rootPath, '.windsurfrules');
    let currentContent = '';
    if (await this.fileSystem.exists(windsurfPath)) {
      currentContent = await this.fileSystem.readFile(windsurfPath);
    }
    const separator = '\n\n# Antigravity Rules\n\n';
    if (!currentContent.includes('# Antigravity Rules')) {
      await this.fileSystem.writeFile(windsurfPath, currentContent + separator + rulesContent);
      this.logger.success('Integrated with Windsurf (.windsurfrules)');
    } else {
      this.logger.info('Windsurf already configured, skipping append.');
    }

    // 2. Roles (.windsurf/rules/)
    for (const role of roles) {
        const roleFileName = `${role.toLowerCase()}.md`;
        const sourcePath = path.join(projectDetails.rootPath, projectDetails.workflowDirectory, roleFileName);
        
        if (await this.fileSystem.exists(sourcePath)) {
          const ruleContent = await this.fileSystem.readFile(sourcePath);
          const rolePath = path.join(projectDetails.rootPath, '.windsurf/rules', roleFileName);
          await this.fileSystem.createDirectory(path.dirname(rolePath));
          await this.fileSystem.writeFile(rolePath, ruleContent);
        }
      }
      this.logger.success('Integrated Roles with Windsurf (.windsurf/rules/*.md)');
  }

  private async integrateGemini(projectDetails: IProjectDetails, rulesContent: string): Promise<void> {
    const geminiPath = path.join(projectDetails.rootPath, '.gemini/settings.json');
    await this.fileSystem.createDirectory(path.dirname(geminiPath));
    const geminiConfig = {
      codeAssist: {
        customInstructions: rulesContent.substring(0, 2000),
      },
    };
    await this.fileSystem.writeFile(geminiPath, JSON.stringify(geminiConfig, null, 2));
    this.logger.success('Integrated with Gemini Code Assist (.gemini/settings.json)');
  }

  private getDefaultBuildCommand(packageManager: PackageManager): string {
    switch (packageManager) {
      case PackageManager.YARN:
        return 'yarn build';
      case PackageManager.PNPM:
        return 'pnpm build';
      case PackageManager.BUN:
        return 'bun run build';
      case PackageManager.CARGO:
        return 'cargo build';
      case PackageManager.POETRY:
        return 'poetry build';
      case PackageManager.GO_MODULES:
        return 'go build';
      case PackageManager.MAVEN:
        return 'mvn package';
      case PackageManager.GRADLE:
        return 'gradle build';
      case PackageManager.NUGET:
        return 'dotnet build';
      default:
        return 'npm run build';
    }
  }

  private getDefaultTestCommand(packageManager: PackageManager): string {
    switch (packageManager) {
      case PackageManager.YARN:
        return 'yarn test';
      case PackageManager.PNPM:
        return 'pnpm test';
      case PackageManager.BUN:
        return 'bun test';
      case PackageManager.CARGO:
        return 'cargo test';
      case PackageManager.POETRY:
        return 'poetry run pytest';
      case PackageManager.GO_MODULES:
        return 'go test ./...';
      case PackageManager.MAVEN:
        return 'mvn test';
      case PackageManager.GRADLE:
        return 'gradle test';
      case PackageManager.NUGET:
        return 'dotnet test';
      default:
        return 'npm run test';
    }
  }

  private async executeWithConfig(configPath: string): Promise<void> {
    const projectRoot = process.cwd();
    const fullConfigPath = path.isAbsolute(configPath) ? configPath : path.join(projectRoot, configPath);
    
    if (!await this.fileSystem.exists(fullConfigPath)) {
        this.logger.error(`Configuration file not found: ${fullConfigPath}`);
        return;
    }

    this.logger.info(`Loading configuration from ${fullConfigPath}...`);
    const content = await this.fileSystem.readFile(fullConfigPath);
    
    try {
        const projectDetails = JSON.parse(content) as IProjectDetails;
        
        // Override paths to current context
        projectDetails.rootPath = projectRoot;
        if (projectDetails.language) {
            this.localizationService.setLanguage(projectDetails.language);
        }

        this.logger.info('Using configuration to skip prompts.');
        const roles = projectDetails.roles || [WorkflowRole.DEVELOPER]; // Default if missing
        
        await this.generateFiles(projectDetails, roles);
        
        if (projectDetails.ideIntegrations) {
            await this.integrateWithIde(projectDetails, projectDetails.ideIntegrations, roles);
        }
        
        this.logger.success('Project initialized from configuration successfully.');

    } catch (e) {
        this.logger.error(`Failed to parse configuration: ${(e as Error).message}`);
    }
  }
}
