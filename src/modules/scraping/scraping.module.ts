import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ScrapingService } from './scraping.service';
import { ScrapingController } from './scraping.controller';
import { AiTranslationService } from './ai-translation.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ScrapingService, AiTranslationService],
  controllers: [ScrapingController],
  exports: [ScrapingService, AiTranslationService],
})
export class ScrapingModule {}