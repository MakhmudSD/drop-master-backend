import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { MultiPlatformProductsService } from './multi-platform-products.service';
import { MultiPlatformProductsResolver } from './multi-platform-products.resolver';
import { Product, ProductSchema } from '../../schemas/product.schema';
import { ScrapingModule } from '../scraping/scraping.module';
import { AiTranslationService } from '../scraping/ai-translation.service';
import { ScrapingService } from '../scraping/scraping.service';
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
		ProductsResolver,
		MultiPlatformProductsService,
		MultiPlatformProductsResolver,
		AiTranslationService,
		ScrapingService,
	],
	exports: [ProductsService],
})
export class ProductsModule {}
