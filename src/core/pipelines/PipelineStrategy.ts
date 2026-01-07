import { IProjectDetails } from '../interfaces';
import { BackendFramework, FrontendFramework, SmartContractFramework } from '../types';

export interface IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean;
  getTemplateName(): string;
}

export class ScryptoPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.smartContract === SmartContractFramework.SCRYPTO;
  }
  getTemplateName(): string {
    return 'github-scrypto.yml.ejs';
  }
}

export class RustPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.backend === BackendFramework.RUST;
  }
  getTemplateName(): string {
    return 'github-rust.yml.ejs';
  }
}

export class PythonPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.backend === BackendFramework.PYTHON;
  }
  getTemplateName(): string {
    return 'github-python.yml.ejs';
  }
}

export class DotNetPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.backend === BackendFramework.ASPNET_CORE;
  }
  getTemplateName(): string {
    return 'github-dotnet.yml.ejs';
  }
}

export class NestJSPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.backend === BackendFramework.NESTJS;
  }
  getTemplateName(): string {
    return 'github-nestjs.yml.ejs';
  }
}

export class FlutterPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.frontend === FrontendFramework.FLUTTER;
  }
  getTemplateName(): string {
    return 'github-flutter.yml.ejs';
  }
}

export class ReactPipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return project.techStack.frontend !== FrontendFramework.NONE && project.techStack.frontend !== FrontendFramework.FLUTTER;
  }
  getTemplateName(): string {
    return 'github-react.yml.ejs';
  }
}

export class DefaultNodePipelineStrategy implements IPipelineStrategy {
  canHandle(project: IProjectDetails): boolean {
    return true; // Fallback
  }
  getTemplateName(): string {
    return 'github-node.yml.ejs';
  }
}

export class PipelineStrategyFactory {
  private strategies: IPipelineStrategy[] = [
    new ScryptoPipelineStrategy(),
    new RustPipelineStrategy(),
    new PythonPipelineStrategy(),
    new DotNetPipelineStrategy(),
    new NestJSPipelineStrategy(),
    new FlutterPipelineStrategy(),
    new ReactPipelineStrategy(), // Checks if frontend != NONE
    new DefaultNodePipelineStrategy()
  ];

  getStrategy(project: IProjectDetails): IPipelineStrategy {
    for (const strategy of this.strategies) {
      if (strategy.canHandle(project)) {
        return strategy;
      }
    }
    return new DefaultNodePipelineStrategy();
  }
}
