import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { ScrapeProductDto, ScrapeProductResponseDto } from '../../libs/dto';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @Post('scrape')
  async scrapeProduct(@Body() dto: ScrapeProductDto): Promise<ScrapeProductResponseDto> {
    try {
      const product = await this.scrapingService.scrapeProduct(dto);
      
      if (product) {
        return {
          success: true,
          product: {
            source: product.platform,
            url: product.url,
            title: product.title,
            price: product.price,
            image: product.imageUrl,
            stock: 'In Stock',
            lastUpdated: new Date(),
          },
        };
      } else {
        return {
          success: false,
          error: 'Failed to scrape product',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  @Get('health')
   healthCheck() {
    return {
      success: true,
      message: 'Scraping service is running',
      timestamp: new Date().toISOString(),
    };
  }
}