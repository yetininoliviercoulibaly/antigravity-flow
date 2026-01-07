import * as path from 'path';
import { IPipelineGenerator, IFileSystem, ITemplateProvider, ILogger, IProjectDetails } from './interfaces';
import { PipelineStrategyFactory } from './pipelines/PipelineStrategy';

export class PipelineGenerator implements IPipelineGenerator {
  private strategyFactory = new PipelineStrategyFactory();
  
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger
  ) {}

  async generatePipeline(projectDetails: IProjectDetails): Promise<void> {
    const strategy = this.strategyFactory.getStrategy(projectDetails);
    const templateName = strategy.getTemplateName();

    const templatePath = `en/pipelines/${templateName}`; // Hardcoded to EN for config files? Or use local? Config files usually don't need translation but let's stick to structure.

    try {
        const templateContent = await this.templateProvider.getTemplate(templatePath);
        const rendered = this.templateProvider.render(templateContent, {
            project: projectDetails
        });

        await this.fileSystem.createDirectory(projectDetails.workflowDirectory);
        const outputPath = path.join(projectDetails.workflowDirectory, 'ci.yml');
        await this.fileSystem.writeFile(outputPath, rendered);
        
        this.logger.success(`CI/CD Pipeline generated: ${projectDetails.workflowDirectory}/ci.yml`);
    } catch (error) {
        this.logger.error(`Failed to generate pipeline: ${(error as Error).message}`);
    }
  }
}
