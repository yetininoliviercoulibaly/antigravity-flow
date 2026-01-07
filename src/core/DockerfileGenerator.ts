import * as path from 'path';
import { IFileSystem, ILogger, ITemplateProvider, IDockerfileGenerator } from './interfaces';
import { TechStack, BackendFramework, PackageManager } from './types';

export class DockerfileGenerator implements IDockerfileGenerator {
  constructor(
    private fileSystem: IFileSystem,
    private templateProvider: ITemplateProvider,
    private logger: ILogger,
  ) {}

  async generate(projectRoot: string, techStack: TechStack): Promise<void> {
    this.logger.info('Generating Dockerfile...');

    let templateName = '';
    const data: any = {
      port: 3000,
      packageManager: 'npm',
      installCommand: 'npm install',
      buildCommand: 'npm run build',
      startCommand: 'npm run start:prod',
    };

    switch (techStack.packageManager) {
        case PackageManager.YARN:
            data.packageManager = 'yarn';
            data.installCommand = 'yarn install --frozen-lockfile';
            data.buildCommand = 'yarn build';
            data.startCommand = 'yarn start:prod';
            break;
        case PackageManager.PNPM:
            data.packageManager = 'pnpm';
            data.installCommand = 'pnpm install --frozen-lockfile';
            data.buildCommand = 'pnpm build';
            data.startCommand = 'pnpm start:prod';
            break;
        case PackageManager.BUN:
            data.packageManager = 'bun';
            data.installCommand = 'bun install --frozen-lockfile';
            data.buildCommand = 'bun run build';
            data.startCommand = 'bun run start:prod';
            break;
    }

    switch (techStack.backend) {
      case BackendFramework.NESTJS:
        templateName = 'docker/nestjs.Dockerfile.ejs';
        break;
      case BackendFramework.EXPRESS:
        templateName = 'docker/node.Dockerfile.ejs'; 
        break;
      case BackendFramework.FASTAPI:
        templateName = 'docker/python.Dockerfile.ejs';
        data.port = 8000;
        data.installCommand = 'pip install -r requirements.txt';
        data.startCommand = 'uvicorn main:app --host 0.0.0.0 --port 8000';
        if (techStack.packageManager === PackageManager.POETRY) {
             data.installCommand = 'poetry install --no-dev';
             data.startCommand = 'poetry run uvicorn main:app --host 0.0.0.0 --port 8000';
        }
        break;
      case BackendFramework.DJANGO:
        templateName = 'docker/django.Dockerfile.ejs';
        data.port = 8000;
        data.startCommand = 'python manage.py runserver 0.0.0.0:8000'; // Or gunicorn
        break;
      case BackendFramework.SPRING_BOOT:
        templateName = 'docker/springboot.Dockerfile.ejs';
        data.port = 8080;
        break;
      case BackendFramework.GO:
      case BackendFramework.GIN:
      case BackendFramework.RUST: // Using Go template for Rust??? No, stick to Go. Wait, RUST has no dockerfile?
        // Ah, Rust was not in original switch. Let's add Go first.
        if (techStack.backend === BackendFramework.RUST) {
             // TODO: Rust Dockerfile template
             this.logger.warn('Rust Dockerfile template not yet implemented.');
             return;
        }
        templateName = 'docker/go.Dockerfile.ejs';
        data.port = 8080;
        break;
      default:
        this.logger.warn(`No Dockerfile template found for backend: ${techStack.backend}`);
        return;
    }

    try {
      const templateContent = await this.templateProvider.getTemplate(templateName);
      const dockerfileContent = this.templateProvider.render(templateContent, data);
      
      const outputPath = path.join(projectRoot, 'Dockerfile');
      if (await this.fileSystem.exists(outputPath)) {
          this.logger.warn('Dockerfile already exists. Skipping generation.');
      } else {
          await this.fileSystem.writeFile(outputPath, dockerfileContent);
          this.logger.success('Dockerfile generated successfully.');
          
          // Also generate .dockerignore
          const dockerignorePath = path.join(projectRoot, '.dockerignore');
          if (!await this.fileSystem.exists(dockerignorePath)) {
              try {
                  const ignoreTemplate = await this.templateProvider.getTemplate('docker/dockerignore.ejs');
                  // No data needed for now, but good to have
                  const ignoreContent = this.templateProvider.render(ignoreTemplate, {});
                  await this.fileSystem.writeFile(dockerignorePath, ignoreContent);
                  this.logger.success('.dockerignore generated successfully.');
              } catch (e) {
                  this.logger.warn('Failed to generate .dockerignore from template.');
              }
          }
      }

    } catch (error) {
      this.logger.error('Failed to generate Dockerfile.');
    }
  }
}
