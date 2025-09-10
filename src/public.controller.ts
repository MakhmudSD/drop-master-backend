import { Controller, Get, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './modules/products/products.service';

@Controller('public')
export class PublicController {
  constructor(private productsService: ProductsService) {}

  @Get('products/popular')
  async getPopularProducts(
    @Query('platform', new DefaultValuePipe('coupang')) platform: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.productsService.getPopularProducts(platform, limit);
  }
}
