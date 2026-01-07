import { IFileSystem, ILogger, ITemplateProvider, IProjectDetails, ILocalizationService, IRulesComposer, IContextGenerator } from './interfaces';
import { WorkflowRole, WORKFLOW_FILES } from './types';
import * as path from 'path';

export class WorkflowGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger,
    private localizationService: ILocalizationService,
    private rulesComposer: IRulesComposer,
    private contextGenerator: IContextGenerator,
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

  async generateProjectContext(project: IProjectDetails): Promise<void> {
    const contextContent = await this.contextGenerator.generateContext(project);
    const contextPath = path.join(project.rootPath, '.agent/project-context.md');
    
    // Ensure .agent exists (it should if workflows run, but safety first)
    await this.ensureDirectory(path.dirname(contextPath));

    await this.fileSystem.writeFile(contextPath, contextContent);
    this.logger.success(`Created: ${contextPath}`);
  }

  private async generateWorkflowForRole(
    role: WorkflowRole,
    project: IProjectDetails,
    outputDir: string,
  ): Promise<void> {
    const fileName = WORKFLOW_FILES[role];
    const outputPath = path.join(outputDir, fileName);
    let content = '';

    if (role === WorkflowRole.RULES) {
       this.logger.info(`Generaring customized rules for stack: ${project.techStack.frontend}/${project.techStack.backend}...`);
       content = await this.rulesComposer.composeRules(project.techStack);
    } else {
        const lang = this.localizationService.getLanguage();
        const templatePath = path.join(lang, `${role}.md.ejs`);
        this.logger.info(`Generating ${fileName} from template ${templatePath}...`);

        try {
            const templateContent = await this.templateProvider.getTemplate(templatePath);
            content = this.templateProvider.render(templateContent, {
                buildCommand: project.buildCommand,
                testCommand: project.testCommand,
            });
        } catch (error) {
            this.logger.error(`Failed to generate ${fileName}: ${(error as Error).message}`);
            return;
        }
    }

    try {
      await this.fileSystem.writeFile(outputPath, content);
      this.logger.success(`Created: ${outputPath}`);
    } catch (error) {
      this.logger.error(`Failed to write ${fileName}: ${(error as Error).message}`);
    }
  }
}
