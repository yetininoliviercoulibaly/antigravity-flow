import inquirer from 'inquirer';
import { WorkflowGenerator } from '../core/WorkflowGenerator';
import { WorkflowRole, FrontendFramework, BackendFramework, ArchitectureType, RigorMode } from '../core/types';
import { ILogger, ILocalizationService, IPipelineGenerator } from '../core/interfaces';

export class InitCommand {
  constructor(
    private workflowGenerator: WorkflowGenerator,
    private logger: ILogger,
    private localizationService: ILocalizationService,
    private pipelineGenerator: IPipelineGenerator,
  ) {}

  async execute(): Promise<void> {
    // 1. Ask for Language
    const langAnswer = await inquirer.prompt([
        {
            type: 'list',
            name: 'language',
            message: 'Select language / Choisissez votre langue',
            choices: ['en', 'fr'],
            default: 'en'
        }
    ]);

    // 2. Set Language
    this.localizationService.setLanguage(langAnswer.language);

    // 3. Welcome Message (Localized)
    this.logger.info(this.localizationService.translate('prompts.welcome'));
    this.logger.info(this.localizationService.translate('prompts.intro'));

    const projectRoot = process.cwd();

    // 4. Ask localized questions
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectDescription',
        message: this.localizationService.translate('prompts.project_description') || 'Project Description:',
        default: 'My awesome project',
      },
      {
          type: 'list',
          name: 'frontend',
          message: 'Frontend Framework:',
          choices: Object.values(FrontendFramework),
          default: FrontendFramework.NONE,
      },
      {
          type: 'list',
          name: 'backend',
          message: 'Backend Framework:',
          choices: Object.values(BackendFramework),
          default: BackendFramework.NONE,
      },
      {
          type: 'list',
          name: 'architecture',
          message: 'Architecture:',
          choices: Object.values(ArchitectureType),
          default: ArchitectureType.HEXAGONAL,
      },
      {
          type: 'list',
          name: 'rigor',
          message: this.localizationService.translate('prompts.rigor') || 'Rigor Level:',
          choices: Object.values(RigorMode),
          default: RigorMode.STRICT,
      },
      {
          type: 'confirm',
          name: 'isMonorepo',
          message: this.localizationService.translate('prompts.is_monorepo') || 'Is this a Monorepo?',
          default: false,
      },
      {
          type: 'input',
          name: 'apps',
          message: this.localizationService.translate('prompts.monorepo_apps') || 'List your apps (comma separated):',
          when: (answers) => answers.isMonorepo,
          filter: (input) => input.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0),
      },
      {
        type: 'input',
        name: 'buildCommand',
        message: this.localizationService.translate('prompts.build_command'),
        default: 'npm run build',
      },
      {
        type: 'input',
        name: 'testCommand',
        message: this.localizationService.translate('prompts.test_command'),
        default: 'npm run test',
      },
      {
        type: 'checkbox',
        name: 'roles',
        message: this.localizationService.translate('prompts.workflows_selection'),
        choices: Object.values(WorkflowRole).map(role => ({
            name: this.localizationService.translate(`roles.${role}`),
            value: role
        })),
        default: [WorkflowRole.DEVELOPER, WorkflowRole.QA, WorkflowRole.LEAD_DEV],
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: this.localizationService.translate('prompts.confirm'),
        default: true,
      },
    ]);

    if (!answers.confirm) {
      this.logger.warn(this.localizationService.translate('prompts.cancelled'));
      return;
    }

    try {
      const projectDetails = {
        rootPath: projectRoot,
        workflowDirectory: '.agent/workflows',
        rulesDirectory: '.agent/rules',
        buildCommand: answers.buildCommand,
        testCommand: answers.testCommand,
        techStack: {
            frontend: answers.frontend,
            backend: answers.backend,
        },
        architecture: answers.architecture,
        rigor: answers.rigor,
        projectDescription: answers.projectDescription,
        isMonorepo: answers.isMonorepo,
        apps: answers.apps,
      };

      await this.workflowGenerator.generateWorkflows(projectDetails, answers.roles);
      await this.workflowGenerator.generateProjectContext(projectDetails);
      await this.pipelineGenerator.generatePipeline(projectDetails);

    } catch (error) {
      this.logger.error(this.localizationService.translate('prompts.failed'));
      console.error(error);
    }
  }
}
