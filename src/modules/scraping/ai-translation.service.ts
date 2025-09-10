/* eslint-disable @typescript-eslint/require-await */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiTranslationService {
  async translateProductTitle(title: string, targetLanguage: string = 'ko'): Promise<string> {
    // Simple translation logic - in a real implementation, this would use OpenAI or another translation service
    if (targetLanguage === 'ko') {
      return `[한국어] ${title}`;
    }
    return title;
  }

  async translateProductDescription(description: string, targetLanguage: string = 'ko'): Promise<string> {
    // Simple translation logic
    if (targetLanguage === 'ko') {
      return `[한국어] ${description}`;
    }
    return description;
  }
}
