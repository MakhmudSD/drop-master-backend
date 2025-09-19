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

  // New method for scraping Naver products with search query
  async scrapeNaverProducts(query: string, limit: number = 20): Promise<ScrapedProduct[]> {
    try {
      console.log(`Scraping Naver products for query: ${query}, limit: ${limit}`);
      
      // For now, we'll use a search approach since we can't access Naver's internal APIs
      // In a real implementation, you might use Puppeteer for more complex scraping
      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;
      
      const response = await firstValueFrom(
        this.httpService.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          },
        }),
      );

      const $ = cheerio.load(response.data);
      const products: ScrapedProduct[] = [];
      
      // Naver Shopping search results selectors (these may need adjustment based on actual HTML structure)
      $('.product_item, .basicList_item__2XT81').each((index, element) => {
        if (products.length >= limit) return false;
        
        const $element = $(element);
        
        const title = $element.find('.product_title, .basicList_title__3P9Q7').text().trim() ||
                     $element.find('a[data-i]').attr('title') || '';
        
        const priceText = $element.find('.price_num, .price_price__2WUXn').text().trim() ||
                         $element.find('.price').text().trim();
        const price = this.parsePrice(priceText);
        
        const imageUrl = $element.find('img').attr('src') ||
                        $element.find('img').attr('data-src') || '';
        
        const link = $element.find('a').attr('href') || '';
        const fullLink = link.startsWith('http') ? link : `https://shopping.naver.com${link}`;
        
        const seller = $element.find('.product_mall, .basicList_mall__3EFGQ').text().trim();
        
        if (title && price > 0) {
          products.push({
            id: this.generateId(),
            title: title.replace(/<[^>]*>/g, ''), // Remove HTML tags
            name: title.replace(/<[^>]*>/g, ''),
            price,
            imageUrl: imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl,
            url: fullLink,
            platform: 'naver',
            category: '',
            salesCount: Math.floor(Math.random() * 1000) + 100, // Mock data
            rating: Math.floor(Math.random() * 50) / 10 + 4, // Mock rating 4.0-4.9
            reviewCount: Math.floor(Math.random() * 500) + 50, // Mock review count
            seller: seller,
            description: `${title} - 네이버 쇼핑에서 판매중`,
            brand: '',
            availability: 'In Stock',
            shippingInfo: '무료배송',
            tags: [query],
            originalPrice: '',
            discount: 0,
            stock: Math.floor(Math.random() * 100) + 10,
            location: '대한민국',
            link: fullLink,
            competitionLevel: 'medium',
          });
        }
      });

      console.log(`Successfully scraped ${products.length} Naver products`);
      return products;
      
    } catch (error) {
      console.error('Error scraping Naver products:', error);
      // Return empty array on error - fallback will be handled by ProductsService
      return [];
    }
  }
}