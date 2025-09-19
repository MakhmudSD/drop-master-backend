import { Resolver, Query, Args } from '@nestjs/graphql';
import { MultiPlatformProductsService } from './multi-platform-products.service';
import { SimpleProduct } from '../../graphql/types/simple-product.type';

@Resolver(() => SimpleProduct)
export class MultiPlatformProductsResolver {
  constructor(private readonly multiPlatformProductsService: MultiPlatformProductsService) {}

  @Query(() => [SimpleProduct], { name: 'fetchProducts' })
  async fetchProducts(
    @Args('platform') platform: string,
    @Args('queries', { type: () => [String] }) queries: string[],
  ): Promise<SimpleProduct[]> {
    return await this.multiPlatformProductsService.fetchProducts(platform, queries);
  }
}
