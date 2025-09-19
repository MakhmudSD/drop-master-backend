/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiTranslationService } from '../scraping/ai-translation.service';
import { ScrapingService } from '../scraping/scraping.service';
import { Product, ProductDocument } from '../../schemas/product.schema';
import { CreateProductDto, BulkOperationsDto } from '../../libs/dto';
import { FALLBACK_PRODUCTS } from './fallback-products.data';
@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
		private aiTranslationService: AiTranslationService,
		private scrapingService: ScrapingService,
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

	public async getPopularProducts(platform: string = 'coupang', limit: number = 20, query?: string) {
		try {
			let products: any[] = [];
			
			// If platform is 'naver' and ScrapingService is configured, fetch products
			if (platform === 'naver') {
				try {
					const searchQuery = query || '인기상품';
					console.log(`Fetching Naver products with query: ${searchQuery}`);
					
					const scrapedProducts = await this.scrapingService.scrapeNaverProducts(searchQuery, limit);
					
					if (scrapedProducts && scrapedProducts.length > 0) {
						// Transform scraped products to match our expected format
						products = scrapedProducts.map(product => ({
							id: product.id,
							title: product.title,
							name: product.name || product.title,
							price: product.price,
							imageUrl: product.imageUrl,
							salesCount: product.salesCount || Math.floor(Math.random() * 1000) + 100,
							growthRate: Math.floor(Math.random() * 30) + 5, // Mock growth rate 5-35%
							estimatedMargin: Math.floor(Math.random() * 40) + 15, // Mock margin 15-55%
							platform: product.platform,
							description: product.description || '',
							brand: product.brand || '',
							category: product.category || '',
							availability: product.availability || 'In Stock',
							rating: product.rating || 0,
							reviewCount: product.reviewCount || 0,
							shippingInfo: product.shippingInfo || '',
							tags: product.tags || [],
							originalPrice: product.originalPrice || '',
							discount: product.discount || 0,
							stock: product.stock || 0,
							seller: product.seller || '',
							location: product.location || '',
							link: product.link || product.url,
							competitionLevel: product.competitionLevel || 'medium',
						}));
						
						console.log(`Successfully fetched ${products.length} products from Naver`);
						
						return {
							success: true,
							products,
							platform,
							count: products.length,
							message: 'Data fetched from Naver Shopping',
						};
					}
				} catch (scrapingError) {
					console.error('Naver scraping failed:', scrapingError);
					// Fall through to fallback data
				}
			}
			
			// For other platforms or when Naver scraping fails, return fallback data
			products = this.getFallbackProducts(platform, limit);

			return {
				success: true,
				products,
				platform,
				count: products.length,
				message: platform === 'naver' ? 'Using fallback data - Naver scraping failed' : 'Using fallback data',
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
		const platformProducts = FALLBACK_PRODUCTS[platform] || FALLBACK_PRODUCTS.coupang;
		return platformProducts.slice(0, Math.min(limit, platformProducts.length));
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
		const descriptionKorean = description ? await this.aiTranslationService.translateProductDescription(description) : undefined;

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
