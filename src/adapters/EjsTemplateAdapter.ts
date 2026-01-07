import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ITemplateProvider } from '../core/interfaces';

export class EjsTemplateAdapter implements ITemplateProvider {
  constructor(private templatesDir: string) {}

  async getTemplate(templateName: string): Promise<string> {
    // Determine file path. Assuming templateName maps to filename without extension or with.
    // In our types we used 'dev' -> 'dev.md'. Ideally templates source might be 'dev.md.ejs'
    const fileName = `${templateName}.md.ejs`;
    const templatePath = path.join(this.templatesDir, fileName);

    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    return fs.readFile(templatePath, 'utf8');
  }

  render(templateContent: string, data: Record<string, any>): string {
    return ejs.render(templateContent, data);
  }
}
