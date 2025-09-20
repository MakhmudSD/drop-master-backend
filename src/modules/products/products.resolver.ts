/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductType } from '../../graphql/types/product.type';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [ProductType], { name: 'popularProducts' })
  public async getPopularProducts(
    @Args('platform') platform: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('query', { nullable: true }) query?: string,
    @Args('timeFilter', { nullable: true }) timeFilter?: string,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<ProductType[]> {
    const result = await this.productsService.getPopularProducts(platform, limit, query, timeFilter, userId);
    // Transform the products to match our GraphQL type
    return (result.products || []).map((product: any) => ({
      id: product.id || product._id || `${platform}-${Date.now()}`,
      title: product.title || product.name || 'Product Title',
      name: product.name || product.title || 'Product Name',
      price: parseFloat(product.price) || 0.0,
      imageUrl: product.imageUrl || product.image || '/images/placeholder.png',
      link: product.link || product.url || '#',
      platform: product.platform || platform,
      salesCount: parseInt(product.salesCount) || 0,
      growthRate: parseFloat(product.growthRate) || 0.0,
      estimatedMargin: parseFloat(product.estimatedMargin) || 0.0,
      description: product.description || '',
      brand: product.brand || '',
      category: product.category || '',
      availability: product.availability || 'In Stock',
      rating: parseFloat(product.rating) || 0.0,
      reviewCount: parseInt(product.reviewCount) || 0,
      shippingInfo: product.shippingInfo || '',
      tags: product.tags || [],
      specifications: product.specifications || '',
      originalPrice: product.originalPrice || '',
      discount: parseFloat(product.discount) || 0.0,
      stock: parseInt(product.stock) || 0,
      seller: product.seller || '',
      location: product.location || '',
      competitionLevel: product.competitionLevel || 'medium',
      alibabaPrice: parseFloat(product.alibabaPrice) || 0.0,
    }));
  }

  @Query(() => ProductType, { name: 'product' })
  public async getProduct(
    @Args('id') id: string,
    @Args('userId', { nullable: true }) userId?: string,
  ): Promise<ProductType> {
    try {
      const result = await this.productsService.getProduct(id, userId || null);
      const product = result.product;
      
      // Transform the product to match our GraphQL type
      return {
        id: product._id || product.id || id,
        title: product.title || 'Product Title',
        name: product.title || 'Product Name', // Use title as name since name doesn't exist in schema
        price: parseFloat(String(product.priceKRW || product.price)) || 0.0,
        imageUrl: product.imageUrls?.[0] || product.image || '/images/placeholder.png',
        link: product.sourceUrl || product.url || '#',
        platform: product.targetPlatform || product.source || 'coupang',
        description: product.descriptionKorean || product.description || '',
        brand: '', // brand doesn't exist in schema
        category: product.category || '',
        availability: product.stock || 'In Stock',
        rating: 0.0,
        reviewCount: 0,
        shippingInfo: '',
        tags: [],
        specifications: '',
        originalPrice: '',
        discount: 0.0,
        stock: 0,
        seller: '',
        location: '',
        competitionLevel: product.competitionLevel || 'medium',
        alibabaPrice: 0.0,
        salesCount: product.salesCount || 0,
        growthRate: product.growthRate || 0.0,
        estimatedMargin: parseFloat(String(product.marginRate)) || 0.0,
      };
    } catch (error) {
      // Return a fallback product if not found
      return {
        id: id,
        title: 'Product Not Found',
        name: 'Product Not Found',
        price: 0.0,
        imageUrl: '/images/placeholder.png',
        link: '#',
        platform: 'coupang',
        description: 'This product could not be found.',
        brand: '',
        category: '',
        availability: 'Out of Stock',
        rating: 0.0,
        reviewCount: 0,
        shippingInfo: '',
        tags: [],
        specifications: '',
        originalPrice: '',
        discount: 0.0,
        stock: 0,
        seller: '',
        location: '',
        competitionLevel: 'medium',
        alibabaPrice: 0.0,
        salesCount: 0,
        growthRate: 0.0,
        estimatedMargin: 0.0,
      };
    }
  }
}
