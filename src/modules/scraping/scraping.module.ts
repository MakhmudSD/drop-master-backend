import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ScrapingController } from './scraping.controller';
import { ScraperApiController } from './scraper-api.controller';
import { ScrapingService } from './scraping.service';
import { ScraperApiService } from './scraper-api.service';
import { RealScraperService } from './real-scraper.service';
import { EnhancedScraperService } from './enhanced-scraper.service';
import { WorkingScraperService } from './working-scraper.service';
import { SimpleScraperService } from './simple-scraper.service';
import { RobustScraperService } from './robust-scraper.service';
import { AiTranslationService } from './ai-translation.service';
import { ScrapingRun, ScrapingRunSchema } from '../../shared/schemas/scraping-run.schema';
import { ProductsModule } from '../products/products.module';
import { Product, ProductSchema } from '../../shared/schemas/product.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: ScrapingRun.name, schema: ScrapingRunSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  forwardRef(() => ProductsModule),
  ],
  controllers: [ScrapingController, ScraperApiController],
  providers: [
    ScrapingService,
    ScraperApiService,
    RealScraperService,
    EnhancedScraperService,
    WorkingScraperService,
    SimpleScraperService,
    RobustScraperService,
    AiTranslationService,
  ],
  exports: [ScrapingService, ScraperApiService, AiTranslationService, RealScraperService, EnhancedScraperService],
})
export class ScrapingModule {}
