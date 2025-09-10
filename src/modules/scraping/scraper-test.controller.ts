import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { RealScraperService } from './real-scraper.service';
import { Public } from '../../shared/decorators/public.decorator';
import { HttpService } from '@nestjs/axios';

@Controller('scraper-test')
export class ScraperTestController {
  constructor(private realScraperService: RealScraperService, private httpService: HttpService) {}

  @Get('health')
  @Public()
  healthCheck() {
    try {
      const isHealthy = true; // Real scraper service is always healthy
      return {
        success: true,
        healthy: isHealthy,
        message: isHealthy ? 'Scraper API is healthy' : 'Scraper API is not responding',
      };
    } catch (error) {
      return {
        success: false,
        healthy: false,
        error: error.message,
      };
    }
  }

  @Get('status')
  @Public()
  getStatus() {
    try {
      const status = { status: 'active', method: 'real-scraping' };
      return {
        success: true,
        status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Post('test-scrape')
  @Public()
  async testScrape(@Body() body: { platform: string; keywords?: string[]; maxResults?: number }) {
    try {
      const { platform, keywords = [], maxResults = 5 } = body;
      
      let products;
      switch (platform) {
        case 'coupang':
          products = await this.realScraperService.scrapeCoupangProducts(keywords, maxResults);
          break;
        case 'naver':
          products = await this.realScraperService.scrapeNaverProducts(keywords, maxResults);
          break;
        case '11st':
          products = await this.realScraperService.scrape11stProducts(keywords, maxResults);
          break;
        case 'aliexpress':
          products = await this.realScraperService.scrapeAliExpressProducts(keywords, maxResults);
          break;
        case 'alibaba':
          products = await this.realScraperService.scrapeAlibabaProducts(keywords, maxResults);
          break;
        default:
          return {
            success: false,
            error: 'Unsupported platform',
          };
      }

      return {
        success: true,
        platform,
        products,
        count: products.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        platform: body.platform,
      };
    }
  }

  @Get('test-all-platforms')
  @Public()
  async testAllPlatforms() {
    const platforms = ['coupang', 'naver', '11st', 'aliexpress', 'alibaba'];
    const results = {};

    for (const platform of platforms) {
      try {
        let products;
        switch (platform) {
          case 'coupang':
            products = await this.realScraperService.scrapeCoupangProducts(['test'], 2);
            break;
          case 'naver':
            products = await this.realScraperService.scrapeNaverProducts(['test'], 2);
            break;
          case '11st':
            products = await this.realScraperService.scrape11stProducts(['test'], 2);
            break;
          case 'aliexpress':
            products = await this.realScraperService.scrapeAliExpressProducts(['test'], 2);
            break;
          case 'alibaba':
            products = await this.realScraperService.scrapeAlibabaProducts(['test'], 2);
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
