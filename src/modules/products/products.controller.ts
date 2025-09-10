import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Patch,
	Delete,
	Query,
	UseGuards,
	Request,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	DefaultValuePipe,
	Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { EnhancedScraperService } from '../scraping/enhanced-scraper.service';
import { CreateProductDto } from '../../shared/dto/create-product.dto';
import { BulkOperationsDto } from '../../shared/dto/bulk-operations.dto';
import { ScrapeProductDto } from '../../shared/dto/scrape-product.dto';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('products')
export class ProductsController {
	constructor(
		private productsService: ProductsService,
		private enhancedScraperService: EnhancedScraperService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getProducts(
		@Request() req,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
		@Query('status') status?: string,
		@Query('platform') platform?: string,
		@Query('category') category?: string,
	) {
		return this.productsService.getProducts(req.user.userId, {
			page,
			limit,
			status,
			platform,
			category,
		});
	}

	@Public()
	@Get('popular')
	async getPopularProducts(
		@Query('platform', new DefaultValuePipe('coupang')) platform: string,
		@Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
	) {
		return this.productsService.getPopularProducts(platform, limit);
	}


	@Get(':id')
	async getProduct(@Param('id') id: string, @Request() req) {
		return this.productsService.getProduct(id, req.user.userId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async createProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
		return this.productsService.createProduct(createProductDto, req.user.userId);
	}

	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	async updateProduct(@Param('id') id: string, @Body() updateData: Partial<CreateProductDto>, @Request() req) {
		return this.productsService.updateProduct(id, updateData, req.user.userId);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.OK)
	async deleteProduct(@Param('id') id: string, @Request() req) {
		return this.productsService.deleteProduct(id, req.user.userId);
	}

	@Post('bulk')
	@HttpCode(HttpStatus.OK)
	async bulkOperations(@Body() bulkData: BulkOperationsDto, @Request() req) {
		return this.productsService.bulkOperations(bulkData, req.user.userId);
	}

	@Get('stats/overview')
	async getStatsOverview(@Request() req) {
		return this.productsService.getStatsOverview(req.user.userId);
	}

	@Post('scrape')
	@HttpCode(HttpStatus.OK)
	async scrapeProduct(@Body() scrapeDto: ScrapeProductDto, @Request() req) {
		try {
			const scrapedData = await this.enhancedScraperService.scrapeProduct(
				scrapeDto.url,
				scrapeDto.source
			);

			// Create product using the existing service
			const createProductDto = {
				title: scrapedData.title,
				description: `Scraped from ${scrapedData.source}`,
				priceKRW: scrapedData.price,
				sourcePrice: scrapedData.price * 0.7, // Assume 30% margin
				marginRate: 30,
				category: 'General',
				targetPlatform: 'coupang',
				sourcePlatform: scrapedData.source,
				sourceUrl: scrapedData.url,
				imageUrls: [scrapedData.image],
				status: 'draft',
				source: scrapedData.source,
				url: scrapedData.url,
				price: scrapedData.price,
				image: scrapedData.image,
				stock: scrapedData.stock,
				lastUpdated: scrapedData.lastUpdated,
			};

			const result = await this.productsService.createProduct(createProductDto, req.user.userId);

			return {
				success: true,
				product: scrapedData,
				savedProduct: result.product,
				message: 'Product scraped and saved successfully',
			};
		} catch (error) {
			return {
				success: false,
				error: error.message,
			};
		}
	}

	@Put('update')
	@HttpCode(HttpStatus.OK)
	async updateAllProducts(@Request() req) {
		try {
			await this.enhancedScraperService.updateAllProducts();
			return {
				success: true,
				message: 'All products updated successfully',
			};
		} catch (error) {
			return {
				success: false,
				error: error.message,
			};
		}
	}
}
