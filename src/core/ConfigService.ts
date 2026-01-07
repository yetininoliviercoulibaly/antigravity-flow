import * as path from 'path';
import { IFileSystem, ILogger, IProjectDetails } from './interfaces';

export interface IConfigService {
  saveConfig(projectDetails: IProjectDetails): Promise<void>;
  loadConfig(rootPath: string): Promise<IProjectDetails | null>;
}

export class ConfigService implements IConfigService {
  private configPath = '.agent/antigravity.json';

  constructor(
    private fileSystem: IFileSystem,
    private logger: ILogger
  ) {}

  async saveConfig(projectDetails: IProjectDetails): Promise<void> {
    try {
      const fullPath = path.join(projectDetails.rootPath, this.configPath);
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      await this.fileSystem.createDirectory(dir);
      
      const content = JSON.stringify(projectDetails, null, 2);
      await this.fileSystem.writeFile(fullPath, content);
      this.logger.success(`Configuration saved to ${this.configPath}`);
    } catch (error) {
      this.logger.error(`Failed to save configuration: ${(error as Error).message}`);
    }
  }

  async loadConfig(rootPath: string): Promise<IProjectDetails | null> {
    try {
      const fullPath = path.join(rootPath, this.configPath);
      if (await this.fileSystem.exists(fullPath)) {
          const content = await this.fileSystem.readFile(fullPath);
          return JSON.parse(content) as IProjectDetails;
      }
      return null;
    } catch (error) {
        this.logger.warn(`Could not load configuration from ${this.configPath}`);
        return null;
    }
  }
}
