import { IFileSystem, ILogger, ITemplateProvider, IProjectDetails, ILocalizationService } from './interfaces';
import { WorkflowRole, WORKFLOW_FILES } from './types';
import * as path from 'path';

export class WorkflowGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger,
    private localizationService: ILocalizationService,
  ) {}

  /**
   * Generates workflow files for the specified project.
   */
  async generateWorkflows(project: IProjectDetails, roles: WorkflowRole[]): Promise<void> {
    this.logger.info(this.localizationService.translate('prompts.intro'));
    
    // Ensure .agent/workflows directory exists for standard workflows
    const workflowsDir = path.join(project.rootPath, project.workflowDirectory);

    // Generate each selected role workflow
    for (const role of roles) {
      if (role === WorkflowRole.RULES) {
          if (project.rulesDirectory) {
              const rulesDir = path.join(project.rootPath, project.rulesDirectory);
              await this.ensureDirectory(rulesDir);
              await this.generateWorkflowForRole(role, project, rulesDir);
          }
      } else {
          await this.ensureDirectory(workflowsDir);
          await this.generateWorkflowForRole(role, project, workflowsDir);
      }
    }

    this.logger.success(this.localizationService.translate('prompts.success'));
  }

  private async ensureDirectory(dirPath: string): Promise<void> {
      if (!(await this.fileSystem.exists(dirPath))) {
          this.logger.info(`Creating directory: ${dirPath}`);
          await this.fileSystem.createDirectory(dirPath);
      }
  }

  private async generateWorkflowForRole(
    role: WorkflowRole,
    project: IProjectDetails,
    outputDir: string,
  ): Promise<void> {
    const fileName = WORKFLOW_FILES[role];
    const outputPath = path.join(outputDir, fileName);
    const lang = this.localizationService.getLanguage(); // Get current language
    
    // Template path now includes language: src/templates/<lang>/<role>.md.ejs
    const templatePath = path.join(lang, `${role}.md.ejs`);

    this.logger.info(`Generating ${fileName} from template ${templatePath}...`);

    try {
      const templateContent = await this.templateProvider.getTemplate(templatePath);
      const content = this.templateProvider.render(templateContent, {
        buildCommand: project.buildCommand,
        testCommand: project.testCommand,
      });

      await this.fileSystem.writeFile(outputPath, content);
      this.logger.success(`Created: ${outputPath}`);
    } catch (error) {
      this.logger.error(`Failed to generate ${fileName}: ${(error as Error).message}`);
    }
  }
}
