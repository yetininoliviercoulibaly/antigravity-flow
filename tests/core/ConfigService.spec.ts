import { ConfigService } from '../../src/core/ConfigService';
import { IFileSystem, ILogger, IProjectDetails } from '../../src/core/interfaces';
import { BackendFramework, FrontendFramework, SmartContractFramework, ArchitectureType, RigorMode, WorkflowRole } from '../../src/core/types';
import * as path from 'path';

describe('ConfigService', () => {
    let configService: ConfigService;
    let mockFileSystem: jest.Mocked<IFileSystem>;
    let mockLogger: jest.Mocked<ILogger>;

    const projectDetails: IProjectDetails = {
        rootPath: '/test/root',
        workflowDirectory: '.github/workflows',
        rulesDirectory: '.agent/rules',
        techStack: { frontend: FrontendFramework.NONE, backend: BackendFramework.NODE, smartContract: SmartContractFramework.NONE },
        architecture: ArchitectureType.MVC,
        rigor: RigorMode.STRICT,
        buildCommand: 'npm run build',
        testCommand: 'npm run test',
    };

    beforeEach(() => {
        mockFileSystem = {
            exists: jest.fn(),
            readFile: jest.fn(),
            writeFile: jest.fn(),
            createDirectory: jest.fn(),
        };
        mockLogger = {
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
            success: jest.fn(),
        };
        configService = new ConfigService(mockFileSystem, mockLogger);
    });

    it('should save configuration successfully', async () => {
        await configService.saveConfig(projectDetails);

        const expectedPath = path.join(projectDetails.rootPath, '.agent/antigravity.json');
        
        expect(mockFileSystem.createDirectory).toHaveBeenCalledWith(path.dirname(expectedPath));
        expect(mockFileSystem.writeFile).toHaveBeenCalledWith(
            expectedPath,
            JSON.stringify(projectDetails, null, 2)
        );
        expect(mockLogger.success).toHaveBeenCalledWith(expect.stringContaining('Configuration saved'));
    });

    it('should load configuration if exists', async () => {
        const expectedPath = path.join(process.cwd(), '.agent/antigravity.json');
        mockFileSystem.exists.mockResolvedValue(true);
        mockFileSystem.readFile.mockResolvedValue(JSON.stringify(projectDetails));

        // Note: loadConfig currently uses process.cwd() as internal variable logic might differ.
        // Let's check implementation behavior regarding rootPath argument.
        // My implementation: async loadConfig(rootPath: string)
        
        await configService.loadConfig('/test/loader');
        
        const expectedCallPath = path.join('/test/loader', '.agent/antigravity.json');

        expect(mockFileSystem.exists).toHaveBeenCalledWith(expectedCallPath);
        expect(mockFileSystem.readFile).toHaveBeenCalledWith(expectedCallPath);
    });

    it('should return null if configuration does not exist', async () => {
        mockFileSystem.exists.mockResolvedValue(false);
        const result = await configService.loadConfig('/test/missing');
        expect(result).toBeNull();
    });

    it('should handle errors during save', async () => {
        mockFileSystem.writeFile.mockRejectedValue(new Error('Write Error'));
        await configService.saveConfig(projectDetails);
        expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to save configuration'));
    });
});
