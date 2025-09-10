import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from './products.service';
import { ScrapingRun, ScrapingRunDocument } from 'src/shared/schemas/scraping-run.schema';
import { ScrapeProductsDto } from 'src/shared/dto/scrape-products.dto';
import { RealScraperService } from 'src/modules/scraping/real-scraper.service';

@Injectable()
export class ScrapingService {
	constructor(
		@InjectModel(ScrapingRun.name)
		private scrapingRunModel: Model<ScrapingRunDocument>,
		private realScraperService: RealScraperService,
		@Inject(forwardRef(() => ProductsService))
		private productsService: ProductsService,
	) {}

	async scrapeCoupang(scrapeDto: ScrapeProductsDto, userId: string) {
		const { keywords = [], maxResults = 20 } = scrapeDto;

		try {
			const products = await this.realScraperService.scrapeCoupangProducts(keywords, maxResults);

			const scrapingRun = new this.scrapingRunModel({
				userId,
				platform: 'coupang',
				runId: `coupang_${Date.now()}`,
				status: 'completed',
				keywords,
				maxResults,
				results: products,
				completedAt: new Date(),
			});

			await scrapingRun.save();

			return {
				success: true,
				runId: scrapingRun.runId,
				products,
				count: products.length,
			};
		} catch (error) {
			console.error('Coupang scraping error:', error);
			return {
				success: false,
				error: 'Failed to scrape Coupang products',
			};
		}
	}

	async scrapeNaver(scrapeDto: ScrapeProductsDto, userId: string) {
		const { keywords = [], maxResults = 20 } = scrapeDto;

		try {
			const products = await this.realScraperService.scrapeNaverProducts(keywords, maxResults);

			const scrapingRun = new this.scrapingRunModel({
				userId,
				platform: 'naver',
				runId: `naver_${Date.now()}`,
				status: 'completed',
				keywords,
				maxResults,
				results: products,
				completedAt: new Date(),
			});

			await scrapingRun.save();

			return {
				success: true,
				runId: scrapingRun.runId,
				products,
				count: products.length,
			};
		} catch (error) {
			console.error('Naver scraping error:', error);
			return {
				success: false,
				error: 'Failed to scrape Naver products',
			};
		}
	}

	async scrape11st(scrapeDto: ScrapeProductsDto, userId: string) {
		const { keywords = [], maxResults = 20 } = scrapeDto;

		try {
			const products = await this.realScraperService.scrape11stProducts(keywords, maxResults);

			const scrapingRun = new this.scrapingRunModel({
				userId,
				platform: '11st',
				runId: `11st_${Date.now()}`,
				status: 'completed',
				keywords,
				maxResults,
				results: products,
				completedAt: new Date(),
			});

			await scrapingRun.save();

			return {
				success: true,
				runId: scrapingRun.runId,
				products,
				count: products.length,
			};
		} catch (error) {
			console.error('11st scraping error:', error);
			return {
				success: false,
				error: 'Failed to scrape 11st products',
			};
		}
	}

	async scrapeAliExpress(scrapeDto: ScrapeProductsDto, userId: string) {
		const { keywords = [], maxResults = 20 } = scrapeDto;

		try {
			const products = await this.realScraperService.scrapeAliExpressProducts(keywords, maxResults);

			const scrapingRun = new this.scrapingRunModel({
				userId,
				platform: 'aliexpress',
				runId: `aliexpress_${Date.now()}`,
				status: 'completed',
				keywords,
				maxResults,
				results: products,
				completedAt: new Date(),
			});

			await scrapingRun.save();

			return {
				success: true,
				runId: scrapingRun.runId,
				products,
				count: products.length,
			};
		} catch (error) {
			console.error('AliExpress scraping error:', error);
			return {
				success: false,
				error: 'Failed to scrape AliExpress products',
			};
		}
	}

	async scrapeAlibaba(scrapeDto: ScrapeProductsDto, userId: string) {
		const { keywords = [], maxResults = 20 } = scrapeDto;

		try {
			const products = await this.realScraperService.scrapeAlibabaProducts(keywords, maxResults);

			const scrapingRun = new this.scrapingRunModel({
				userId,
				platform: 'alibaba',
				runId: `alibaba_${Date.now()}`,
				status: 'completed',
				keywords,
				maxResults,
				results: products,
				completedAt: new Date(),
			});

			await scrapingRun.save();

			return {
				success: true,
				runId: scrapingRun.runId,
				products,
				count: products.length,
			};
		} catch (error) {
			console.error('Alibaba scraping error:', error);
			return {
				success: false,
				error: 'Failed to scrape Alibaba products',
			};
		}
	}

	async getScrapingStatus(runId: string) {
		const run = await this.scrapingRunModel.findOne({ runId });
		if (!run) {
			return {
				success: false,
				error: 'Scraping run not found',
			};
		}

		return {
			success: true,
			status: run.status,
			runId: run.runId,
			platform: run.platform,
			completedAt: run.completedAt,
		};
	}

	async getScrapingResults(runId: string) {
		const run = await this.scrapingRunModel.findOne({ runId });
		if (!run) {
			return {
				success: false,
				error: 'Scraping run not found',
			};
		}

		return {
			success: true,
			results: run.results,
			count: run.results?.length || 0,
		};
	}

	async processScrapingResults(runId: string, processData: { platform: string }, userId: string) {
		const run = await this.scrapingRunModel.findOne({ runId, userId });
		if (!run) {
			return {
				success: false,
				error: 'Scraping run not found',
			};
		}

		// Process and save products from scraping results
		const processedProducts: Array<{
			title: string;
			description: string;
			priceKRW: number;
			sourcePrice: number;
			marginRate: number;
			category: string;
			targetPlatform: string;
			sourcePlatform: string;
			sourceUrl: string;
			imageUrls: string[];
			salesCount: number;
			growthRate: number;
			competitionLevel: string;
		}> = [];
		for (const item of (run.results as Array<{
			title?: string;
			description?: string;
			price?: number;
			alibabaPrice?: number;
			estimatedMargin?: number;
			category?: string;
			productUrl?: string;
			imageUrl?: string;
			salesCount?: number;
			growthRate?: number;
			competitionLevel?: string;
		}>) || []) {
			try {
				const productData = {
					title: item.title || 'Unknown Product',
					description: item.description || '',
					priceKRW: item.price || 0,
					sourcePrice: item.alibabaPrice || 0,
					marginRate: item.estimatedMargin || 0,
					category: item.category || 'General',
					targetPlatform: processData?.platform || 'coupang',
					sourcePlatform: run.platform,
					sourceUrl: item.productUrl || '',
					imageUrls: item.imageUrl ? [item.imageUrl] : [],
					salesCount: item.salesCount || 0,
					growthRate: item.growthRate || 0,
					competitionLevel: item.competitionLevel || 'medium',
				};

				// This would normally call the products service to create products
				// For now, we'll just return the processed data
				processedProducts.push(productData);
			} catch (error) {
				console.error('Error processing product:', error);
			}
		}

		return {
			success: true,
			processedProducts,
			count: processedProducts.length,
		};
	}

	async getScrapingHistory(userId: string) {
		const runs = await this.scrapingRunModel.find({ userId }).sort({ createdAt: -1 }).limit(50);

		return {
			success: true,
			runs,
			count: runs.length,
		};
	}

	async stopScraping(runId: string) {
			// In a real implementation, this would stop the scraping run
		// For now, we'll just update the status
		const run = await this.scrapingRunModel.findOneAndUpdate({ runId }, { status: 'cancelled' }, { new: true });

		if (!run) {
			return {
				success: false,
				error: 'Scraping run not found',
			};
		}

		return {
			success: true,
			message: 'Scraping stopped successfully',
		};
	}
}
