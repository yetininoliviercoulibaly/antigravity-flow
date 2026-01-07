import { RulesComposer } from '../../src/core/RulesComposer';
import { ITemplateProvider, ILocalizationService } from '../../src/core/interfaces';
import { TechStack, FrontendFramework, BackendFramework } from '../../src/core/types';

describe('RulesComposer', () => {
  let rulesComposer: RulesComposer;
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
    rulesComposer = new RulesComposer(mockTemplateProvider, mockLocalizationService);
  });

  it('should compose rules with base and framework specific fragments', async () => {
    const stack: TechStack = {
      frontend: FrontendFramework.REACT,
      backend: BackendFramework.NESTJS,
    };

    const baseTemplate = 'Base Rules\n';
    const reactTemplate = 'React Rules\n';
    const nestTemplate = 'NestJS Rules\n';

    mockTemplateProvider.getTemplate.mockImplementation(async (path) => {
      if (path.includes('base-rules.md.ejs')) return baseTemplate;
      if (path.includes('react.md.ejs')) return reactTemplate;
      if (path.includes('nestjs.md.ejs')) return nestTemplate;
      return '';
    });

    // Mock render to just return the content as is for this test
    mockTemplateProvider.render.mockImplementation((content) => content);

    const result = await rulesComposer.composeRules(stack);

    expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('base-rules'));
    expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('react'));
    expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('nestjs'));
    
    expect(result).toContain('Base Rules');
    expect(result).toContain('React Rules');
    expect(result).toContain('NestJS Rules');
  });

  it('should not include framework rules if framework is NONE', async () => {
    const stack: TechStack = {
      frontend: FrontendFramework.NONE,
      backend: BackendFramework.NONE,
    };

    mockTemplateProvider.getTemplate.mockResolvedValue('Rule Content');
    mockTemplateProvider.render.mockImplementation((c) => c);

    await rulesComposer.composeRules(stack);

    expect(mockTemplateProvider.getTemplate).toHaveBeenCalledWith(expect.stringContaining('base-rules'));
    expect(mockTemplateProvider.getTemplate).not.toHaveBeenCalledWith(expect.stringContaining('react'));
    expect(mockTemplateProvider.getTemplate).not.toHaveBeenCalledWith(expect.stringContaining('node'));
  });
});
