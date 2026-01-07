import * as path from 'path';
import { IPipelineGenerator, IFileSystem, ITemplateProvider, ILogger, IProjectDetails } from './interfaces';
import { FrontendFramework, BackendFramework } from './types';

export class PipelineGenerator implements IPipelineGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger
  ) {}

  async generatePipeline(projectDetails: IProjectDetails): Promise<void> {
    // Determine which template to use based on stack
    // Priority: Frontend first (often determines CLI behavior like flutter), then Backend
    // In a real monorepo scenario we might generate multiple, but for MVP we pick the dominant one.
    
    let templateName = 'github-node.yml.ejs'; // default

    if (projectDetails.techStack.frontend === FrontendFramework.FLUTTER) {
        templateName = 'github-flutter.yml.ejs';
    } else if (projectDetails.techStack.frontend !== FrontendFramework.NONE) {
        // Assume JS/TS frontend (React, Vue, etc)
        templateName = 'github-react.yml.ejs';
    } else if (projectDetails.techStack.backend === BackendFramework.NESTJS) {
        templateName = 'github-nestjs.yml.ejs';
    } else if (projectDetails.techStack.backend === BackendFramework.ASPNET_CORE) {
        templateName = 'github-dotnet.yml.ejs';
    } else if (projectDetails.techStack.backend === BackendFramework.PYTHON) {
        templateName = 'github-python.yml.ejs';
    }

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
