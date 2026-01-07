import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs-extra';
import { ITemplateProvider } from '../core/interfaces';

export class EjsTemplateAdapter implements ITemplateProvider {
  constructor(private templatesDir: string) {}

  async getTemplate(templatePath: string): Promise<string> {
    const fullPath = path.join(this.templatesDir, templatePath);

    if (!(await fs.pathExists(templatePath))) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    return fs.readFile(templatePath, 'utf8');
  }

  render(templateContent: string, data: Record<string, any>): string {
    return ejs.render(templateContent, data);
  }
}
