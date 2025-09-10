import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiTranslationService } from '../scraping/ai-translation.service';
import { RealScraperService } from '../scraping/real-scraper.service';
import { Product, ProductDocument } from '../../shared/schemas/product.schema';
import { CreateProductDto } from '../../shared/dto/create-product.dto';
import { BulkOperationsDto } from '../../shared/dto/bulk-operations.dto';
@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
		private aiTranslationService: AiTranslationService,
		private realScraperService: RealScraperService,
	) {}

	async getProducts(
		userId: string,
		options: {
			page: number;
			limit: number;
			status?: string;
			platform?: string;
			category?: string;
		},
	) {
		const { page, limit, status, platform, category } = options;
		const skip = (page - 1) * limit;

		const filter: {
			userId: string;
			status?: string;
			targetPlatform?: string;
			category?: string;
		} = { userId };
		if (status) filter.status = status;
		if (platform) filter.targetPlatform = platform;
		if (category) filter.category = category;

		const products = await this.productModel.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

		const total = await this.productModel.countDocuments(filter);

		return {
			success: true,
			products,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit),
			},
		};
	}

	async getPopularProducts(platform: string = 'coupang', limit: number = 20) {
		try {
			let products: any[] = [];
			switch (platform) {
				case 'coupang':
					products = await this.realScraperService.scrapeCoupangProducts([], limit);
					break;
				case 'naver':
					products = await this.realScraperService.scrapeNaverProducts([], limit);
					break;
				case '11st':
					products = await this.realScraperService.scrape11stProducts([], limit);
					break;
				case 'aliexpress':
					products = await this.realScraperService.scrapeAliExpressProducts([], limit);
					break;
				case 'alibaba':
					products = await this.realScraperService.scrapeAlibabaProducts([], limit);
					break;
				default:
					products = await this.realScraperService.scrapeCoupangProducts([], limit);
			}

			return {
				success: true,
				products,
				platform,
				count: products.length,
			};
		} catch (error) {
			console.error(`${platform} scraping error:`, error);
			
			// Provide fallback demo data when scraping fails
			const fallbackProducts = this.getFallbackProducts(platform, limit);
			
			return {
				success: true,
				products: fallbackProducts,
				platform,
				count: fallbackProducts.length,
				message: 'Using fallback data - scraping failed',
			};
		}
	}

	private getFallbackProducts(platform: string, limit: number) {
		const baseProducts = [
			{
				id: '1',
				title: 'AirPods Pro 2nd Gen',
				name: '에어팟 프로 2세대 무선이어폰',
				price: 289000,
				imageUrl: '/logos/coupang.png',
				salesCount: 1250,
				growthRate: 15.2,
				estimatedMargin: 25.5,
				platform: platform
			},
			{
				id: '2',
				title: 'Galaxy S24 Transparent Jelly Case',
				name: '갤럭시 S24 투명 젤리케이스',
				price: 8900,
				imageUrl: '/logos/naver.png',
				salesCount: 850,
				growthRate: 22.8,
				estimatedMargin: 18.3,
				platform: platform
			},
			{
				id: '3',
				title: 'USB C Hub 7-in-1',
				name: 'USB C 허브 7-in-1',
				price: 21900,
				imageUrl: '/logos/11st.png',
				salesCount: 420,
				growthRate: 9.1,
				estimatedMargin: 32.1,
				platform: platform
			},
			{
				id: '4',
				title: 'Wireless Charging Pad',
				name: '무선 충전 패드',
				price: 15900,
				imageUrl: '/logos/coupang.png',
				salesCount: 680,
				growthRate: 12.5,
				estimatedMargin: 28.7,
				platform: platform
			},
			{
				id: '5',
				title: 'Bluetooth Headphones',
				name: '블루투스 헤드폰',
				price: 45000,
				imageUrl: '/logos/naver.png',
				salesCount: 320,
				growthRate: 18.9,
				estimatedMargin: 22.4,
				platform: platform
			}
		];

		// Return limited number of products
		return baseProducts.slice(0, Math.min(limit, baseProducts.length));
	}

	async getProduct(id: string, userId: string) {
		const product = await this.productModel.findOne({ _id: id, userId });
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		return {
			success: true,
			product,
		};
	}

	async createProduct(createProductDto: CreateProductDto, userId: string) {
		const { description, ...productData } = createProductDto;

		// Translate description to Korean
		const descriptionKorean = await this.aiTranslationService.translateProductDescription(description);

		const product = new this.productModel({
			...productData,
			descriptionKorean,
			userId,
		});

		await product.save();

		return {
			success: true,
			product,
		};
	}

	async updateProduct(id: string, updateData: Partial<CreateProductDto>, userId: string) {
		const product = await this.productModel.findOne({ _id: id, userId });
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		// If description is being updated, translate it
		if (updateData.description) {
			updateData.descriptionKorean = await this.aiTranslationService.translateProductDescription(
				updateData.description,
			);
		}

		const updatedProduct = await this.productModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

		return {
			success: true,
			product: updatedProduct,
		};
	}

	async deleteProduct(id: string, userId: string) {
		const product = await this.productModel.findOne({ _id: id, userId });
		if (!product) {
			throw new NotFoundException('Product not found');
		}

		await this.productModel.findByIdAndDelete(id);

		return {
			success: true,
			message: 'Product deleted successfully',
		};
	}

	async bulkOperations(bulkData: BulkOperationsDto, userId: string) {
		const { action, productIds, data } = bulkData;

		switch (action) {
			case 'updateStatus':
				await this.productModel.updateMany({ _id: { $in: productIds }, userId }, { $set: { status: data?.status } });
				break;
			case 'delete':
				await this.productModel.deleteMany({
					_id: { $in: productIds },
					userId,
				});
				break;
			default:
				throw new Error('Invalid bulk action');
		}

		return {
			success: true,
			message: `Bulk ${action} completed successfully`,
		};
	}

	async getStatsOverview(userId: string) {
		const totalProducts = await this.productModel.countDocuments({ userId });
		const draftProducts = await this.productModel.countDocuments({
			userId,
			status: 'draft',
		});
		const confirmedProducts = await this.productModel.countDocuments({
			userId,
			status: 'confirmed',
		});
		const uploadedProducts = await this.productModel.countDocuments({
			userId,
			status: 'uploaded',
		});

		const platformStats = await this.productModel.aggregate([
			{ $match: { userId } },
			{ $group: { _id: '$targetPlatform', count: { $sum: 1 } } },
		]);

		const categoryStats = await this.productModel.aggregate([
			{ $match: { userId } },
			{ $group: { _id: '$category', count: { $sum: 1 } } },
		]);

		return {
			success: true,
			stats: {
				totalProducts,
				draftProducts,
				confirmedProducts,
				uploadedProducts,
				platformStats,
				categoryStats,
			},
		};
	}
}
