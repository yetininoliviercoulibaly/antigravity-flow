
import * as fs from 'fs';
import * as path from 'path';
import { FrontendFramework, BackendFramework, SmartContractFramework, RigorMode } from '../../src/core/types';

describe('Template Integrity', () => {
  const srcTemplatesDir = path.resolve(__dirname, '../../src/templates');
  console.log('Templates Directory:', srcTemplatesDir);
  const languages = ['en', 'fr'];

  const checkFileExists = (lang: string, relativePath: string) => {
    const fullPath = path.join(srcTemplatesDir, lang, relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing template file: ${lang}/${relativePath}`);
    }
  };

  languages.forEach((lang) => {
    describe(`Language: ${lang}`, () => {
      
      it('should have base rules fragment', () => {
        checkFileExists(lang, 'fragments/base-rules.md.ejs');
      });

      it('should have all rigor mode fragments', () => {
        Object.values(RigorMode).forEach((mode) => {
             // RigorMode doesn't have NONE
             checkFileExists(lang, `fragments/rigor/${mode}.md.ejs`);
        });
      });

      it('should have all frontend framework fragments', () => {
        Object.values(FrontendFramework).forEach((fw) => {
          if (fw !== FrontendFramework.NONE) {
            checkFileExists(lang, `fragments/${fw}.md.ejs`);
          }
        });
      });

      it('should have all backend framework fragments', () => {
        Object.values(BackendFramework).forEach((fw) => {
            if (fw !== BackendFramework.NONE) {
                checkFileExists(lang, `fragments/${fw}.md.ejs`);
            }
        });
      });

      it('should have all smart contract framework fragments', () => {
        Object.values(SmartContractFramework).forEach((fw) => {
          if (fw !== SmartContractFramework.NONE) {
            checkFileExists(lang, `fragments/${fw}.md.ejs`);
          }
        });
      });
    });
  });
});
