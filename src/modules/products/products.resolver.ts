import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductType } from '../../graphql/types/product.type';

@Resolver(() => ProductType)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [ProductType], { name: 'popularProducts' })
  async getPopularProducts(
    @Args('platform') platform: string,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('sortBy', { nullable: true }) sortBy?: string,
  ): Promise<ProductType[]> {
    const result = await this.productsService.getPopularProducts(platform, limit);
    // Transform the products to match our GraphQL type
    return (result.products || []).map((product: any) => ({
      id: product.id || product._id || `${platform}-${Date.now()}`,
      title: product.title || product.name || 'Product Title',
      name: product.name || product.title || 'Product Name',
      price: product.price || 0,
      imageUrl: product.imageUrl || product.image || 'https://via.placeholder.com/300x300',
      salesCount: product.salesCount || 0,
      growthRate: product.growthRate || 0,
      estimatedMargin: product.estimatedMargin || 0,
      platform: product.platform || platform,
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
      link: product.link || '',
      competitionLevel: product.competitionLevel || 'medium',
      alibabaPrice: product.alibabaPrice || 0,
    }));
  }

  @Query(() => ProductType, { name: 'product' })
  async getProduct(@Args('id') id: string): Promise<ProductType> {
    // For now, return a mock product since findById doesn't exist
    return {
      id: id,
      title: 'Sample Product',
      name: 'Sample Product',
      price: 10000,
      imageUrl: 'https://via.placeholder.com/300x300',
      platform: 'coupang',
      description: 'Sample product description',
    };
  }
}
