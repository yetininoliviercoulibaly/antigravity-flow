import { PipelineGenerator } from '../../src/core/PipelineGenerator';
import { ITemplateProvider, ILogger, IFileSystem, IProjectDetails } from '../../src/core/interfaces';
import { FrontendFramework, BackendFramework, SmartContractFramework, TechStack, ArchitectureType, RigorMode } from '../../src/core/types';
import * as path from 'path';

describe('PipelineGenerator', () => {
    let pipelineGenerator: PipelineGenerator;
    let mockFileSystem: jest.Mocked<IFileSystem>;
    let mockTemplateProvider: jest.Mocked<ITemplateProvider>;
    let mockLogger: jest.Mocked<ILogger>;

    beforeEach(() => {
        mockFileSystem = {
            createDirectory: jest.fn(),
            exists: jest.fn(),
            readFile: jest.fn(),
            writeFile: jest.fn(),
        };
        mockTemplateProvider = {
            getTemplate: jest.fn(),
            render: jest.fn(),
        };
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            success: jest.fn(),
            error: jest.fn(),
        };
        pipelineGenerator = new PipelineGenerator(mockFileSystem, mockTemplateProvider, mockLogger);
    });

    it('should generate a React pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.REACT, backend: BackendFramework.NONE } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'npm run build',
            testCommand: 'npm run test',
        };

        const templateContent = 'React Workflow Content';
        mockTemplateProvider.getTemplate.mockResolvedValue(templateContent);
        mockTemplateProvider.render.mockReturnValue(templateContent);

        await pipelineGenerator.generatePipeline(projectDetails);

        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-react.yml.ejs'));
        expect(mockFileSystem.createDirectory).toHaveBeenCalledWith(projectDetails.workflowDirectory);
        expect(mockFileSystem.writeFile).toHaveBeenCalledWith(
            path.join(projectDetails.workflowDirectory, 'ci.yml'),
            templateContent
        );
        expect(mockLogger.success).toHaveBeenCalledWith('CI/CD Pipeline generated: .github/workflows/ci.yml');
    });

    it('should generate a Flutter pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.FLUTTER, backend: BackendFramework.NONE } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.PROTOTYPE,
            buildCommand: 'flutter build apk',
            testCommand: 'flutter test',
        };

        const templateContent = 'Flutter Workflow Content';
        mockTemplateProvider.getTemplate.mockResolvedValue(templateContent);
        mockTemplateProvider.render.mockReturnValue(templateContent);

        await pipelineGenerator.generatePipeline(projectDetails);

        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-flutter.yml.ejs'));
    });

    it('should generate a Scrypto pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.NONE, smartContract: SmartContractFramework.SCRYPTO } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'cargo build',
            testCommand: 'cargo test',
        };
        mockTemplateProvider.getTemplate.mockResolvedValue('Scrypto Content');
        await pipelineGenerator.generatePipeline(projectDetails);
        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-scrypto.yml.ejs'));
    });

    it('should generate a NestJS pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.NESTJS } as TechStack,
            architecture: ArchitectureType.HEXAGONAL,
            rigor: RigorMode.STRICT,
            buildCommand: 'npm run build',
            testCommand: 'npm test',
        };

        const templateContent = 'NestJS Content';
        mockTemplateProvider.getTemplate.mockResolvedValue(templateContent);

        await pipelineGenerator.generatePipeline(projectDetails);

        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-nestjs.yml.ejs'));
    });

    it('should generate a .NET pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.ASPNET_CORE } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'dotnet build',
            testCommand: 'dotnet test',
        };
        mockTemplateProvider.getTemplate.mockResolvedValue('content');
        await pipelineGenerator.generatePipeline(projectDetails);
        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-dotnet.yml.ejs'));
    });

    it('should generate a Python pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.PYTHON } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'python build',
            testCommand: 'python test',
        };
        mockTemplateProvider.getTemplate.mockResolvedValue('content');
        await pipelineGenerator.generatePipeline(projectDetails);
        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-python.yml.ejs'));
    });

    it('should generate a Rust pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.RUST } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'cargo build',
            testCommand: 'cargo test',
        };
        mockTemplateProvider.getTemplate.mockResolvedValue('Rust Content');
        await pipelineGenerator.generatePipeline(projectDetails);
        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-rust.yml.ejs'));
    });

    it('should generate a default Node pipeline workflow', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.NODE } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'npm run build',
            testCommand: 'npm test',
        };
        mockTemplateProvider.getTemplate.mockResolvedValue('Node Content');
        await pipelineGenerator.generatePipeline(projectDetails);
        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('github-node.yml.ejs'));
    });
    
    it('should log error if generation fails', async () => {
        const projectDetails: IProjectDetails = {
            rootPath: '/test/root',
            workflowDirectory: '.github/workflows',
            rulesDirectory: '.agent/rules',
            techStack: { frontend: FrontendFramework.REACT, backend: BackendFramework.NONE } as TechStack,
            architecture: ArchitectureType.MVC,
            rigor: RigorMode.STRICT,
            buildCommand: 'npm run build',
            testCommand: 'npm run test',
        };
        mockTemplateProvider.getTemplate.mockRejectedValue(new Error('Template Fail'));
        
        await pipelineGenerator.generatePipeline(projectDetails);
        
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to generate pipeline'));
    });
});
