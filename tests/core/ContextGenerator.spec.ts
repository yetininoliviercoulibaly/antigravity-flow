import { ContextGenerator } from '../../src/core/ContextGenerator';
import { ITemplateProvider, IProjectDetails, ILocalizationService } from '../../src/core/interfaces';
import { TechStack, FrontendFramework, BackendFramework, ArchitectureType, RigorMode } from '../../src/core/types';

describe('ContextGenerator', () => {
  let contextGenerator: ContextGenerator;
  let mockTemplateProvider: jest.Mocked<ITemplateProvider>;
  let mockLocalizationService: jest.Mocked<ILocalizationService>;

  beforeEach(() => {
    mockTemplateProvider = {
      getTemplate: jest.fn(),
      render: jest.fn(),
    };
    mockLocalizationService = {
      setLanguage: jest.fn(),
      getLanguage: jest.fn().mockReturnValue('en'),
      translate: jest.fn(),
    };
    contextGenerator = new ContextGenerator(mockTemplateProvider, mockLocalizationService);
  });

  it('should generate project context using the template', async () => {
    const project: IProjectDetails = {
      rootPath: '/test/root',
      workflowDirectory: '.agent/workflows',
      buildCommand: 'npm run build',
      testCommand: 'npm test',
      techStack: { frontend: FrontendFramework.REACT, backend: BackendFramework.NESTJS } as TechStack,
      architecture: ArchitectureType.HEXAGONAL,
      rigor: RigorMode.STRICT,
      projectDescription: 'Test Project',
      isMonorepo: true,
      apps: ['app1', 'app2'],
    };

    const templateContent = 'Context Template';
    const renderedContent = 'Rendered Context';

    mockTemplateProvider.getTemplate.mockResolvedValue(templateContent);
    mockTemplateProvider.render.mockReturnValue(renderedContent);

    const result = await contextGenerator.generateContext(project);

    expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith('en/project-context.md.ejs');
    expect(mockTemplateProvider.render).toHaveBeenCalledWith(templateContent, {
      projectDescription: 'Test Project',
      techStack: 'Frontend: react, Backend: nestjs',
      architecture: 'hexagonal',
      buildCommand: 'npm run build',
      testCommand: 'npm test',
      isMonorepo: true,
      apps: ['app1', 'app2'],
    });
    expect(result).toBe(renderedContent);
  });
});
