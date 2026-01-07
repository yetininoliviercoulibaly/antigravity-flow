import { PipelineGenerator } from '../../src/core/PipelineGenerator';
import { ITemplateProvider, ILogger, IFileSystem, IProjectDetails } from '../../src/core/interfaces';
import { FrontendFramework, BackendFramework, TechStack, ArchitectureType, RigorMode } from '../../src/core/types';
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
});
