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
              await this.fileSystem.writeFile(dockerignorePath, 
`node_modules
dist
build
.git
.env
Dockerfile
.dockerignore
`);
             this.logger.success('.dockerignore generated successfully.');
          }
      }

    } catch (error) {
      this.logger.error('Failed to generate Dockerfile.');
      console.error(error);
    }
  }
}
