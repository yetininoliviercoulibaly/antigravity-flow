import { ILocalizationService } from '../core/interfaces';
import * as fs from 'fs-extra';
import * as path from 'path';

export class JsonLocalizationAdapter implements ILocalizationService {
  private currentLang: string = 'en';
  private translations: Record<string, any> = {};

  constructor(private localesPath: string) {}

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.loadTranslations();
  }

  getLanguage(): string {
    return this.currentLang;
  }

  translate(key: string, args?: Record<string, string>): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
        console.warn(`Translation key '${key}' returned non-string value.`, value);
        return key; 
    }

    if (args) {
      for (const [k, v] of Object.entries(args)) {
        value = value.replace(`{{${k}}}`, v);
      }
    }

    return value as string;
  }

  private loadTranslations(): void {
    const filePath = path.join(this.localesPath, `${this.currentLang}.json`);
    if (fs.existsSync(filePath)) {
      this.translations = fs.readJSONSync(filePath);
    } else {
      console.warn(`Locale file not found: ${filePath}`);
      this.translations = {};
    }
  }
}
