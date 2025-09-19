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
  ): Promise<ProductType[]> {
    const result = await this.productsService.getPopularProducts(platform, limit, query, timeFilter);
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
  public getProduct(@Args('id') id: string): Promise<ProductType> {
    // For now, return a mock product since findById doesn't exist
    return Promise.resolve({
      id: id,
      title: 'Sample Product',
      name: 'Sample Product',
      price: 10000.0,
      imageUrl: '/images/placeholder.png',
      link: '#',
      platform: 'coupang',
      description: 'Sample product description',
    });
  }
}
