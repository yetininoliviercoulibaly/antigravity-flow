import { IFileSystem, ILogger, ITemplateProvider, ProjectDetails } from './interfaces';
import { WorkflowRole, WORKFLOW_FILES } from './types';
import * as path from 'path';

export class WorkflowGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger,
  ) {}

  /**
   * Generates workflow files for the specified project.
   */
  async generateWorkflows(project: ProjectDetails, roles: WorkflowRole[]): Promise<void> {
    this.logger.info(`Starting workflow generation for project at: ${project.rootPath}`);

    // Ensure .agent/workflows directory exists
    const workflowsDir = path.join(project.rootPath, project.workflowDirectory);
    if (!(await this.fileSystem.exists(workflowsDir))) {
      this.logger.info(`Creating directory: ${workflowsDir}`);
      await this.fileSystem.createDirectory(workflowsDir);
    }

    // Generate each selected role workflow
    for (const role of roles) {
      await this.generateWorkflowForRole(role, project, workflowsDir);
    }

    this.logger.success('Workflow generation completed successfully.');
  }

  private async generateWorkflowForRole(
    role: WorkflowRole,
    project: ProjectDetails,
    outputDir: string,
  ): Promise<void> {
    const fileName = WORKFLOW_FILES[role];
    const outputPath = path.join(outputDir, fileName);

    this.logger.info(`Generating ${role} workflow: ${fileName}`);

    try {
      if (await this.fileSystem.exists(outputPath)) {
        this.logger.warn(`File ${fileName} already exists. Skipping.`);
        return;
      }

      const templateContent = await this.templateProvider.getTemplate(role);
      const renderedContent = this.templateProvider.render(templateContent, {
        buildCommand: project.buildCommand,
        testCommand: project.testCommand,
      });

      await this.fileSystem.writeFile(outputPath, renderedContent);
      this.logger.info(`Created ${fileName}`);
    } catch (error: any) {
      this.logger.error(`Failed to generate ${fileName}: ${error.message}`);
      throw error;
    }
  }
}
