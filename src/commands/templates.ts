import inquirer from 'inquirer';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ILogger, ILocalizationService } from '../core/interfaces';

export class TemplatesCommand {
  constructor(
    private logger: ILogger,
    private localizationService: ILocalizationService,
    private templatesDir: string,
    private customTemplatesDir: string // .agent/templates
  ) {}

  async execute(action: string, templateName?: string): Promise<void> {
    if (action === 'list') {
      await this.listTemplates();
    } else if (action === 'update') {
      if (!templateName) {
        // Interactive selection if no name provided
        const files = await this.getAllTemplateFiles();
        const answer = await inquirer.prompt([
            {
                type: 'list', // or autocomplete if list is huge? list is safer for now.
                name: 'template',
                message: 'Select a template to update:',
                choices: files
            }
        ]);
        templateName = answer.template;
      }
      if (templateName) {
          await this.updateTemplate(templateName);
      }
    } else {
      this.logger.error(`Unknown action: ${action}. Use 'list' or 'update'.`);
    }
  }

  private async listTemplates(): Promise<void> {
    this.logger.info('Available Templates:');
    const files = await this.getAllTemplateFiles();
    files.forEach(f => {
        // Check if customized
        const isCustom = fs.existsSync(path.join(this.customTemplatesDir, f));
        const status = isCustom ? '[Customized]' : '[Default]   ';
        console.log(`  ${status} ${f}`);
    });
  }

  private async updateTemplate(templateName: string): Promise<void> {
    const defaultPath = path.join(this.templatesDir, templateName);
    const customPath = path.join(this.customTemplatesDir, templateName);

    // 1. Load content (Custom > Default)
    let content = '';
    if (await fs.pathExists(customPath)) {
        content = await fs.readFile(customPath, 'utf8');
    } else if (await fs.pathExists(defaultPath)) {
        content = await fs.readFile(defaultPath, 'utf8');
    } else {
        this.logger.error(`Template not found: ${templateName}`);
        return;
    }

    // 2. Open Editor
    const answer = await inquirer.prompt([
      {
        type: 'editor',
        name: 'content',
        message: `Editing template: ${templateName}`,
        default: content,
      },
    ]);

    const newContent = answer.content;

    // 3. Save to custom location
    if (newContent && newContent.trim() !== '') {
        try {
            await fs.ensureDir(path.dirname(customPath));
            await fs.writeFile(customPath, newContent);
            this.logger.success(`Template saved to: ${customPath}`);
        } catch (error: any) {
            if (error.code === 'EACCES' || error.code === 'EPERM') {
                this.logger.error(`❌ Permission denied. Cannot write to: ${customPath}`);
                this.logger.error('Please check your file permissions or run with elevated privileges.');
            } else {
                this.logger.error(`Failed to save template: ${error.message}`);
            }
        }
    } else {
        this.logger.warn('Empty content. Update cancelled.');
    }
  }

  private async getAllTemplateFiles(dir: string = this.templatesDir, baseDir: string = this.templatesDir): Promise<string[]> {
      let results: string[] = [];
      const list = await fs.readdir(dir);
      for (const file of list) {
          const filePath = path.join(dir, file);
          const stat = await fs.stat(filePath);
          if (stat && stat.isDirectory()) {
              results = results.concat(await this.getAllTemplateFiles(filePath, baseDir));
          } else {
              // relative path from templates dir
              results.push(path.relative(baseDir, filePath).replace(/\\/g, '/'));
          }
      }
      return results;
  }
}
