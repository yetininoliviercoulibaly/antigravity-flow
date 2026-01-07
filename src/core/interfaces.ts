import { ArchitectureType, TechStack } from './types';

export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  success(message: string): void;
}

export interface IFileSystem {
  exists(path: string): Promise<boolean>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  createDirectory(path: string): Promise<void>;
}

export interface ITemplateProvider {
  getTemplate(templateName: string): Promise<string>;
  render(templateContent: string, data: Record<string, any>): string;
}

export interface IProjectDetails {
  rootPath: string;
  workflowDirectory: string;
  rulesDirectory?: string;
  buildCommand: string;
  testCommand: string;
  techStack: TechStack;
  architecture: ArchitectureType;
  projectDescription?: string;
}

export interface ILocalizationService {
  setLanguage(lang: string): void;
  getLanguage(): string;
  translate(key: string, args?: Record<string, string>): string;
}

export interface IRulesComposer {
  composeRules(stack: TechStack): Promise<string>;
}

export interface IContextGenerator {
  generateContext(project: IProjectDetails): Promise<string>;
}
