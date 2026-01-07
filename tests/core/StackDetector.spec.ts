import { StackDetector } from '../../src/core/StackDetector';
import { IFileSystem, ILogger } from '../../src/core/interfaces';
import { BackendFramework, FrontendFramework, SmartContractFramework } from '../../src/core/types';
import * as path from 'path';

describe('StackDetector', () => {
    let stackDetector: StackDetector;
    let mockFileSystem: jest.Mocked<IFileSystem>;
    let mockLogger: jest.Mocked<ILogger>;

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
            success: jest.fn(),
            error: jest.fn(),
        };
        stackDetector = new StackDetector(mockFileSystem, mockLogger);
    });

    it('should detect Rust backend', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('Cargo.toml'));
        mockFileSystem.readFile.mockResolvedValue('name = "test"');

        const result = await stackDetector.detectStack('/root');
        expect(result.backend).toBe(BackendFramework.RUST);
    });

    it('should detect Scrypto smart contract', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('Cargo.toml'));
        mockFileSystem.readFile.mockResolvedValue('[dependencies]\nscrypto = "1.0"');

        const result = await stackDetector.detectStack('/root');
        expect(result.smartContract).toBe(SmartContractFramework.SCRYPTO);
    });

    it('should detect Flutter frontend', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('pubspec.yaml'));
        const result = await stackDetector.detectStack('/root');
        expect(result.frontend).toBe(FrontendFramework.FLUTTER);
    });

    it('should detect Python backend', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('requirements.txt'));
        const result = await stackDetector.detectStack('/root');
        expect(result.backend).toBe(BackendFramework.PYTHON);
    });

    it('should detect React frontend (package.json)', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('package.json'));
        mockFileSystem.readFile.mockResolvedValue(JSON.stringify({
            dependencies: { react: '^18.0.0' }
        }));

        const result = await stackDetector.detectStack('/root');
        expect(result.frontend).toBe(FrontendFramework.REACT);
        expect(result.backend).toBe(BackendFramework.NODE); // Default fallback
    });

    it('should detect NestJS backend (package.json)', async () => {
        mockFileSystem.exists.mockImplementation(async (p) => p.endsWith('package.json'));
        mockFileSystem.readFile.mockResolvedValue(JSON.stringify({
            dependencies: { '@nestjs/core': '^8.0.0' }
        }));

        const result = await stackDetector.detectStack('/root');
        expect(result.backend).toBe(BackendFramework.NESTJS);
    });

    it('should handle errors gracefully', async () => {
        mockFileSystem.exists.mockRejectedValue(new Error('FS Error'));
        const result = await stackDetector.detectStack('/root');
        expect(result).toEqual({});
        expect(mockLogger.warn).toHaveBeenCalled();
    });
});
