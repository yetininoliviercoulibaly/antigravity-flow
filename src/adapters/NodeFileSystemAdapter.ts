import * as fs from 'fs-extra';
import { IFileSystem } from '../core/interfaces';

export class NodeFileSystemAdapter implements IFileSystem {
  async exists(path: string): Promise<boolean> {
    return fs.pathExists(path);
  }

  async readFile(path: string): Promise<string> {
    return fs.readFile(path, 'utf8');
  }

  async writeFile(path: string, content: string): Promise<void> {
    await fs.writeFile(path, content, 'utf8');
  }

  async createDirectory(path: string): Promise<void> {
    await fs.ensureDir(path);
  }
}
