import * as path from 'path';
import { IFileSystem, ILogger } from './interfaces';
import { BackendFramework, FrontendFramework, SmartContractFramework, TechStack } from './types';

export interface IStackDetector {
  detectStack(rootPath: string): Promise<Partial<TechStack>>;
}

export class StackDetector implements IStackDetector {
  constructor(
    private fileSystem: IFileSystem,
    private logger: ILogger
  ) {}

  async detectStack(rootPath: string): Promise<Partial<TechStack>> {
    const stack: Partial<TechStack> = {};

    try {
      // 1. Rust / Scrypto
      const cargoPath = path.join(rootPath, 'Cargo.toml');
      if (await this.fileSystem.exists(cargoPath)) {
        const content = await this.fileSystem.readFile(cargoPath);
        if (content.includes('scrypto')) {
            stack.smartContract = SmartContractFramework.SCRYPTO;
            // Scrypto usually implies backend or part of it, but technically it's smart contract.
            // Often no backend or a separate one.
        } else {
            stack.backend = BackendFramework.RUST; // Default to Rust backend if generic Cargo
        }
      }

      // 2. Flutter
      const pubspecPath = path.join(rootPath, 'pubspec.yaml');
      if (await this.fileSystem.exists(pubspecPath)) {
        stack.frontend = FrontendFramework.FLUTTER;
      }

      // 3. Python
      const requirementsPath = path.join(rootPath, 'requirements.txt');
      const pyprojectPath = path.join(rootPath, 'pyproject.toml');
      if (await this.fileSystem.exists(requirementsPath) || await this.fileSystem.exists(pyprojectPath)) {
          stack.backend = BackendFramework.PYTHON;
      }

      // 4. Node / JS Ecosystem
      const packageJsonPath = path.join(rootPath, 'package.json');
      if (await this.fileSystem.exists(packageJsonPath)) {
          const content = await this.fileSystem.readFile(packageJsonPath);
          const pkg = JSON.parse(content);
          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

          // Frontend detection
          if (allDeps['react'] || allDeps['next']) {
              stack.frontend = FrontendFramework.REACT;
          }
          
          // Backend detection (if not already set by others)
          if (!stack.backend) {
              if (allDeps['@nestjs/core']) {
                  stack.backend = BackendFramework.NESTJS;
              } else {
                  // Default to Node if generic package.json and no other backend specific found
                  // But only if we suspect it's backend.
                  // If just frontend deps, maybe it's just frontend.
                  // We'll set NODE as a safe fallback if no explicit backend framework is found but package.json exists.
                  stack.backend = BackendFramework.NODE;
              }
          }
      }

      // 5. .NET
      // We need to scan for .csproj or .sln
      // Since IFileSystem doesn't support glob/scan easily here without specific implementation,
      // we might skip deep scan or try a common pattern?
      // For now, let's assume if we can't easily glob, we skip or assume user selects it.
      // Or check specific file "Program.cs"?
      // Let's assume user selection for .NET if not easily detectable via 'project.fsproj' etc.
      // Actually, list_dir is not available to the class, only specific file exists checks.
      // So let's skip .NET auto-detect for MVP unless we know a specific file. `*.sln` at root?
      // I can't check wildcard. 
      // I will skip .NET for now.

    } catch (error) {
        this.logger.warn(`Failed to auto-detect stack: ${(error as Error).message}`);
    }

    return stack;
  }
}
