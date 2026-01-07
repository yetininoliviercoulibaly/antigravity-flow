import { WorkflowGenerator } from '../../src/core/WorkflowGenerator';
import { IFileSystem, ILogger, ITemplateProvider, ILocalizationService, IProjectDetails, IRulesComposer, IContextGenerator } from '../../src/core/interfaces';
import { TechStack, ArchitectureType, FrontendFramework, BackendFramework, WorkflowRole } from '../../src/core/types';

describe('WorkflowGenerator', () => {
    let workflowGenerator: WorkflowGenerator;
    let mockFileSystem: jest.Mocked<IFileSystem>;
    let mockTemplateProvider: jest.Mocked<ITemplateProvider>;
    let mockLogger: jest.Mocked<ILogger>;
    let mockLocalizationService: jest.Mocked<ILocalizationService>;
    let mockRulesComposer: jest.Mocked<IRulesComposer>;
    let mockContextGenerator: jest.Mocked<IContextGenerator>;

    const mockProject: IProjectDetails = {
        rootPath: '/test/root',
        workflowDirectory: '.github/workflows',
        rulesDirectory: '.agent/rules',
        techStack: { frontend: FrontendFramework.REACT, backend: BackendFramework.NESTJS } as TechStack,
        architecture: ArchitectureType.HEXAGONAL,
        projectDescription: 'A test project',
        buildCommand: 'npm run build',
        testCommand: 'npm test'
    };

    beforeEach(() => {
        mockFileSystem = {
            exists: jest.fn(),
            readFile: jest.fn(),
            writeFile: jest.fn(),
            createDirectory: jest.fn(),
        };
        mockTemplateProvider = {
            getTemplate: jest.fn(),
            render: jest.fn(),
        };
        mockLogger = {
            info: jest.fn(),
            success: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };
        mockLocalizationService = {
            setLanguage: jest.fn(),
            getLanguage: jest.fn().mockReturnValue('en'),
            translate: jest.fn(),
        };
        mockRulesComposer = {
            composeRules: jest.fn(),
        };
        mockContextGenerator = {
            generateContext: jest.fn(),
        };

        workflowGenerator = new WorkflowGenerator(
            mockFileSystem,
            mockTemplateProvider,
            mockLogger,
            mockLocalizationService,
            mockRulesComposer,
            mockContextGenerator
        );
    });

    it('should inject folder structure fragment for Architect role', async () => {
        const roles = [WorkflowRole.ARCHITECT];
        const folderStructureContent = 'Hexagonal Structure Content';
        const templateContent = 'Architect Template Content <%- folderStructure %>';
        const renderedContent = 'Final Content';

        mockTemplateProvider.getTemplate.mockImplementation(async (path: string) => {
            if (path.includes('fragments/arch/hexagonal.md.ejs')) {
                return folderStructureContent;
            }
            if (path.includes('architect.md.ejs')) {
                return templateContent;
            }
            return '';
        });

        mockTemplateProvider.render.mockReturnValue(renderedContent);
        mockFileSystem.createDirectory.mockResolvedValue(undefined);
        mockFileSystem.writeFile.mockResolvedValue(undefined);

        await workflowGenerator.generateWorkflows(mockProject, roles);

        expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith('en/fragments/arch/hexagonal.md.ejs');
        expect(mockTemplateProvider.render).toHaveBeenCalledWith(templateContent, expect.objectContaining({
            folderStructure: folderStructureContent
        }));
        expect(mockFileSystem.writeFile).toHaveBeenCalled();
    });

    it('should NOT inject folder structure for Developer role', async () => {
        const roles = [WorkflowRole.DEVELOPER];
        const templateContent = 'Dev Template Content';
        
        mockTemplateProvider.getTemplate.mockResolvedValue(templateContent);
        mockTemplateProvider.render.mockReturnValue('Final Content');

        await workflowGenerator.generateWorkflows(mockProject, roles);

        expect(mockTemplateProvider.getTemplate).not.toHaveBeenCalledWith(expect.stringContaining('fragments/arch/'));
    });
});
