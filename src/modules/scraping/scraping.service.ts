import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { ScrapeProductDto, ScrapedProduct } from '../../libs/dto';

@Injectable()
export class ScrapingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async scrapeProduct(dto: ScrapeProductDto): Promise<ScrapedProduct | null> {
    try {
      switch (dto.source) {
        case 'coupang':
          return await this.scrapeCoupangProduct(dto.url);
        case 'naver':
          return await this.scrapeNaverProduct(dto.url);
        case '11st':
          return await this.scrape11stProduct(dto.url);
        case 'aliexpress':
          return await this.scrapeAliExpressProduct(dto.url);
        case 'alibaba':
          return await this.scrapeAlibabaProduct(dto.url);
        default:
          throw new Error(`Unsupported platform: ${dto.source}`);
      }
    } catch (error) {
      console.error(`Error scraping ${dto.source} product:`, error);
      return null;
    }
  }

  async scrapeCoupangProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      
      const title = $('.prod-buy-header__title').text().trim() || 
                   $('h1[data-testid="product-title"]').text().trim();
      
      const priceText = $('.total-price strong').text().trim() || 
                       $('[data-testid="price"]').text().trim();
      const price = this.parsePrice(priceText);

      const imageUrl = $('.prod-image__detail img').attr('src') || 
                      $('[data-testid="product-image"] img').attr('src') || '';

      return {
        id: this.generateId(),
        title,
        name: title,
        price,
        imageUrl,
        url,
        platform: 'coupang',
        category: $('.breadcrumb-item').last().text().trim(),
        salesCount: this.parseSalesCount($('.rating-total-review').text()),
        rating: this.parseRating($('.rating-star-num').text()),
        reviewCount: this.parseReviewCount($('.rating-total-review').text()),
      };
    } catch (error) {
      console.error('Error scraping Coupang product:', error);
      return null;
    }
  }

  async scrapeNaverProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      
      const title = $('.product_info h3').text().trim() || 
                   $('.product_title').text().trim();
      
      const priceText = $('.price .num').text().trim() || 
                       $('.price_value').text().trim();
      const price = this.parsePrice(priceText);

      const imageUrl = $('.product_img img').attr('src') || 
                      $('.product_image img').attr('src') || '';

      return {
        id: this.generateId(),
        title,
        name: title,
        price,
        imageUrl,
        url,
        platform: 'naver',
        category: $('.breadcrumb a').last().text().trim(),
        salesCount: this.parseSalesCount($('.review_count').text()),
        rating: this.parseRating($('.rating_value').text()),
        reviewCount: this.parseReviewCount($('.review_count').text()),
      };
    } catch (error) {
      console.error('Error scraping Naver product:', error);
      return null;
    }
  }

  async scrape11stProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      
      const title = $('.pdp_product_title').text().trim() || 
                   $('.product_title').text().trim();
      
      const priceText = $('.price_detail .price_value').text().trim() || 
                       $('.price .value').text().trim();
      const price = this.parsePrice(priceText);

      const imageUrl = $('.product_img img').attr('src') || 
                      $('.product_image img').attr('src') || '';

      return {
        id: this.generateId(),
        title,
        name: title,
        price,
        imageUrl,
        url,
        platform: '11st',
        category: $('.breadcrumb a').last().text().trim(),
        salesCount: this.parseSalesCount($('.review_count').text()),
        rating: this.parseRating($('.rating_value').text()),
        reviewCount: this.parseReviewCount($('.review_count').text()),
      };
    } catch (error) {
      console.error('Error scraping 11st product:', error);
      return null;
    }
  }

  async scrapeAliExpressProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      
      const title = $('.product-title-text').text().trim() || 
                   $('h1').first().text().trim();
      
      const priceText = $('.price-current .notranslate').text().trim() || 
                       $('.price .value').text().trim();
      const price = this.parsePrice(priceText);

      const imageUrl = $('.images-view-item img').attr('src') || 
                      $('.product-image img').attr('src') || '';

      return {
        id: this.generateId(),
        title,
        name: title,
        price,
        imageUrl,
        url,
        platform: 'aliexpress',
        category: $('.breadcrumb a').last().text().trim(),
        salesCount: this.parseSalesCount($('.sold-count').text()),
        rating: this.parseRating($('.rating-value').text()),
        reviewCount: this.parseReviewCount($('.review-count').text()),
      };
    } catch (error) {
      console.error('Error scraping AliExpress product:', error);
      return null;
    }
  }

  async scrapeAlibabaProduct(url: string): Promise<ScrapedProduct | null> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      
      const title = $('.product-title').text().trim() || 
                   $('h1').first().text().trim();
      
      const priceText = $('.price-current .notranslate').text().trim() || 
                       $('.price .value').text().trim();
      const price = this.parsePrice(priceText);

      const imageUrl = $('.product-image img').attr('src') || 
                      $('.main-image img').attr('src') || '';

      return {
        id: this.generateId(),
        title,
        name: title,
        price,
        imageUrl,
        url,
        platform: 'alibaba',
        category: $('.breadcrumb a').last().text().trim(),
        salesCount: this.parseSalesCount($('.sold-count').text()),
        rating: this.parseRating($('.rating-value').text()),
        reviewCount: this.parseReviewCount($('.review-count').text()),
      };
    } catch (error) {
      console.error('Error scraping Alibaba product:', error);
      return null;
    }
  }

  // Helper methods
  private parsePrice(priceText: string): number {
    if (!priceText) return 0;
    const cleaned = priceText.replace(/[^\d.,]/g, '');
    const price = parseFloat(cleaned.replace(',', ''));
    return isNaN(price) ? 0 : price;
  }

  private parseSalesCount(text: string): number {
    if (!text) return 0;
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private parseRating(text: string): number {
    if (!text) return 0;
    const match = text.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  private parseReviewCount(text: string): number {
    if (!text) return 0;
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}