import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ScraperApiService, ScrapingRequest } from './scraper-api.service';
import { WorkingScraperService } from './working-scraper.service';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';

@Controller('scraper-api')
@UseGuards(JwtAuthGuard)
export class ScraperApiController {
  constructor(
    private scraperApiService: ScraperApiService,
    private workingScraperService: WorkingScraperService,
  ) {}

  @Post('scrape')
  @HttpCode(HttpStatus.OK)
  async scrapeProducts(@Body() request: ScrapingRequest) {
    try {
      const result = await this.scraperApiService.scrapeProducts(request);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('coupang')
  async scrapeCoupang(
    @Query('keywords') keywords?: string,
    @Query('maxResults', new DefaultValuePipe(20), ParseIntPipe) maxResults?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      
      // Try the main scraper first, fallback to working scraper
      let products;
      try {
        products = await this.scraperApiService.scrapeCoupangProducts(keywordArray, maxResults, page);
      } catch (error) {
        console.log('Main scraper failed, using working scraper fallback:', error.message);
        products = await this.workingScraperService.scrapeCoupangProducts(keywordArray, maxResults);
      }
      
      return {
        success: true,
        products,
        count: products.length,
        platform: 'coupang',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('naver')
  async scrapeNaver(
    @Query('keywords') keywords?: string,
    @Query('maxResults', new DefaultValuePipe(20), ParseIntPipe) maxResults?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      
      // Try the main scraper first, fallback to working scraper
      let products;
      try {
        products = await this.scraperApiService.scrapeNaverProducts(keywordArray, maxResults, page);
      } catch (error) {
        console.log('Main scraper failed, using working scraper fallback:', error.message);
        products = await this.workingScraperService.scrapeNaverProducts(keywordArray, maxResults);
      }
      
      return {
        success: true,
        products,
        count: products.length,
        platform: 'naver',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('11st')
  async scrape11st(
    @Query('keywords') keywords?: string,
    @Query('maxResults', new DefaultValuePipe(20), ParseIntPipe) maxResults?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      const products = await this.workingScraperService.scrape11stProducts(keywordArray, maxResults);
      return {
        success: true,
        products,
        count: products.length,
        platform: '11st',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('aliexpress')
  async scrapeAliExpress(
    @Query('keywords') keywords?: string,
    @Query('maxResults', new DefaultValuePipe(20), ParseIntPipe) maxResults?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      const products = await this.workingScraperService.scrapeAliExpressProducts(keywordArray, maxResults);
      return {
        success: true,
        products,
        count: products.length,
        platform: 'aliexpress',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('alibaba')
  async scrapeAlibaba(
    @Query('keywords') keywords?: string,
    @Query('maxResults', new DefaultValuePipe(20), ParseIntPipe) maxResults?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    try {
      const keywordArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
      const products = await this.workingScraperService.scrapeAlibabaProducts(keywordArray, maxResults);
      return {
        success: true,
        products,
        count: products.length,
        platform: 'alibaba',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('health')
  async healthCheck() {
    try {
      const isHealthy = await this.scraperApiService.healthCheck();
      return {
        success: true,
        healthy: isHealthy,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('status')
  async getApiStatus() {
    try {
      const status = await this.scraperApiService.getApiStatus();
      return {
        success: true,
        status,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
