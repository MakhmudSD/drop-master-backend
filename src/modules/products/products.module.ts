import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from '../../shared/schemas/product.schema';
import { ScrapingModule } from '../scraping/scraping.module';
import { AiTranslationService } from '../scraping/ai-translation.service';
import { RealScraperService } from '../scraping/real-scraper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		   MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), 
		   HttpModule.register({
			   timeout: 5000,
			   maxRedirects: 5,
		   }),
		   forwardRef(() => ScrapingModule),
	],
	controllers: [ProductsController],
	providers: [
		ProductsService,
		AiTranslationService,
		RealScraperService,
	],
	exports: [ProductsService],
})
export class ProductsModule {}
