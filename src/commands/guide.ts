import * as path from 'path';
import { ILogger, ILocalizationService, ITemplateProvider } from '../core/interfaces';
import { IConfigService } from '../core/ConfigService';

export class GuideCommand {
  constructor(
    private logger: ILogger,
    private localizationService: ILocalizationService,
    private templateProvider: ITemplateProvider,
    private configService: IConfigService
  ) {}

  async execute(language?: string): Promise<void> {
    try {
      // 1. Determine Language
      let lang = language;
      if (!lang) {
        // Try to load from config
        const projectRoot = process.cwd();
        try {
            const config = await this.configService.loadConfig(projectRoot);
            if (config && config.language) {
                lang = config.language;
            }
        } catch (e) {
            // Ignore config load error, default to English
        }
      }
      
      lang = lang || 'en';
      this.localizationService.setLanguage(lang);

      // 2. Load Guide Template
      // Template provider usually expects paths relative to templates dir
      // e.g. "en/guide.txt"
      const templatePath = path.join(lang, 'guide.txt');
      
      try {
        const content = await this.templateProvider.getTemplate(templatePath);
         // 3. Print
         console.log(content);
      } catch (e) {
          this.logger.error(`Could not load guide for language '${lang}'. Falling back to English.`);
          const fallbackPath = path.join('en', 'guide.txt');
          const content = await this.templateProvider.getTemplate(fallbackPath);
          console.log(content);
      }

    } catch (error) {
      this.logger.error(`Failed to show guide: ${(error as Error).message}`);
    }
  }
}
