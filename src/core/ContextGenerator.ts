import { IContextGenerator, ITemplateProvider, IProjectDetails, ILocalizationService } from './interfaces';

export class ContextGenerator implements IContextGenerator {
  constructor(
      private templateProvider: ITemplateProvider,
      private localizationService: ILocalizationService
  ) {}

  async generateContext(project: IProjectDetails): Promise<string> {
    const lang = this.localizationService.getLanguage();
    const templatePath = `${lang}/project-context.md.ejs`;

    const formattedStack = `Frontend: ${project.techStack.frontend}, Backend: ${project.techStack.backend}`;

    const templateContent = await this.templateProvider.getTemplate(templatePath);
    
    return this.templateProvider.render(templateContent, {
      projectDescription: project.projectDescription || 'N/A',
      techStack: formattedStack,
      architecture: project.architecture,
      buildCommand: project.buildCommand,
      testCommand: project.testCommand,
    });
  }
}
