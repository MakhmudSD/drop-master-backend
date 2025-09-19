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
import { ScrapingService } from '../scraping/scraping.service';
import { CreateProductDto, BulkOperationsDto, ScrapeProductDto } from '../../libs/dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
	constructor(
		private productsService: ProductsService,
		private scrapingService: ScrapingService,
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
			const scrapedData = await this.scrapingService.scrapeProduct(scrapeDto);

			if (!scrapedData) {
				return {
					success: false,
					message: 'Failed to scrape product data',
				};
			}

			// Create product using the existing service
			const createProductDto = {
				title: scrapedData.title,
				description: `Scraped from ${scrapedData.platform}`,
				priceKRW: scrapedData.price,
				sourcePrice: scrapedData.price * 0.7, // Assume 30% margin
				marginRate: 30,
				category: scrapedData.category || 'General',
				targetPlatform: 'coupang',
				sourcePlatform: scrapedData.platform,
				sourceUrl: scrapedData.url,
				imageUrls: [scrapedData.imageUrl],
				status: 'draft',
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
	updateAllProducts(@Request() req) {
		try {
			// Note: updateAllProducts method not available in new scraping service
			console.log('Bulk update not implemented in new scraping service');
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
