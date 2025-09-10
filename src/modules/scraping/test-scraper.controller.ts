import { Controller, Get, Query } from '@nestjs/common';
import { RealScraperService } from './real-scraper.service';
import { Public } from '../../shared/decorators/public.decorator';
import { HttpService } from '@nestjs/axios';

@Controller('test-scraper')
export class TestScraperController {
  constructor(private realScraperService: RealScraperService, private httpService: HttpService) {}

  @Get('coupang')
  @Public()
  async testCoupang(@Query('limit') limit?: string) {
    try {
      const maxResults = parseInt(limit || '5') || 5;
      const products = await this.realScraperService.scrapeCoupangProducts([], maxResults);
      
      return {
        success: true,
        platform: 'coupang',
        count: products.length,
        products: products,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        platform: 'coupang',
      };
    }
  }

  @Get('naver')
  @Public()
  async testNaver(@Query('limit') limit?: string) {
    try {
      const maxResults = parseInt(limit || '5') || 5;
      const products = await this.realScraperService.scrapeNaverProducts([], maxResults);
      
      return {
        success: true,
        platform: 'naver',
        count: products.length,
        products: products,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        platform: 'naver',
      };
    }
  }

  @Get('all')
  @Public()
  async testAll(@Query('limit') limit?: string) {
    const maxResults = parseInt(limit || '3') || 3;
    const platforms = ['coupang', 'naver', '11st', 'aliexpress', 'alibaba'];
    const results = {};

    for (const platform of platforms) {
      try {
        let products;
        switch (platform) {
          case 'coupang':
            products = await this.realScraperService.scrapeCoupangProducts([], maxResults);
            break;
          case 'naver':
            products = await this.realScraperService.scrapeNaverProducts([], maxResults);
            break;
          case '11st':
            products = await this.realScraperService.scrape11stProducts([], maxResults);
            break;
          case 'aliexpress':
            products = await this.realScraperService.scrapeAliExpressProducts([], maxResults);
            break;
          case 'alibaba':
            products = await this.realScraperService.scrapeAlibabaProducts([], maxResults);
            break;
          default:
            products = [];
        }
        
        results[platform] = {
          success: true,
          count: products.length,
          products: products.slice(0, 1), // Show only first product
        };
      } catch (error) {
        results[platform] = {
          success: false,
          error: error.message,
        };
      }
    }

    return {
      success: true,
      results,
    };
  }
}
