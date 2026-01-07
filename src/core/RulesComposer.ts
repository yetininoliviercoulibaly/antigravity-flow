import { IRulesComposer, ITemplateProvider, ILocalizationService } from './interfaces';
import { TechStack, RigorMode } from './types';

export class RulesComposer implements IRulesComposer {
  constructor(
    private templateProvider: ITemplateProvider,
    private localizationService: ILocalizationService
  ) {}

  async composeRules(stack: TechStack, rigor: RigorMode): Promise<string> {
    const lang = this.localizationService.getLanguage();
    const fragments: string[] = [];

    // Base Rules
    const baseTemplatePath = `${lang}/fragments/base-rules.md.ejs`;
    fragments.push(await this.templateProvider.getTemplate(baseTemplatePath));

    // Rigor Mode Rules
    const rigorTemplatePath = `${lang}/fragments/rigor/${rigor}.md.ejs`;
    try {
        fragments.push(await this.templateProvider.getTemplate(rigorTemplatePath));
    } catch (e) {
        console.warn(`Missing rigor fragment: ${rigorTemplatePath}`);
    }

    // Frontend Rules
    if (stack.frontend && stack.frontend !== 'none') {
      const feTemplatePath = `${lang}/fragments/${stack.frontend}.md.ejs`;
      try {
        fragments.push(await this.templateProvider.getTemplate(feTemplatePath));
      } catch (e) {
        // Ignore missing fragments for now or log warning
        console.warn(`Missing rule fragment: ${feTemplatePath}`);
      }
    }

    // Backend Rules
    if (stack.backend && stack.backend !== 'none') {
      const beTemplatePath = `${lang}/fragments/${stack.backend}.md.ejs`;
      try {
        fragments.push(await this.templateProvider.getTemplate(beTemplatePath));
      } catch (e) {
        console.warn(`Missing rule fragment: ${beTemplatePath}`);
      }
    }

    // Render all fragments
    // Note: We might want to pass data to fragments if needed
    const renderedFragments = fragments.map(f => this.templateProvider.render(f, {}));
    
    return renderedFragments.join('\n\n');
  }
}
