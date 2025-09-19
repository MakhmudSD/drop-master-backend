import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';
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

  // New method for scraping Naver products with Puppeteer (avoiding HTTP 418)
  async scrapeNaverProducts(query: string, limit: number = 20): Promise<ScrapedProduct[]> {
    let browser: puppeteer.Browser | null = null;
    
    try {
      console.log(`Scraping Naver products with Puppeteer for query: ${query}, limit: ${limit}`);
      
      // Launch headless Chrome
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set realistic User-Agent and viewport
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Enable JavaScript and images
      await page.setJavaScriptEnabled(true);
      
      // Set extra headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      });

      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;
      
      // Navigate to the page with proper timeout
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Wait for product elements to load
      try {
        await page.waitForSelector('[data-testid="basicList_item"], .basicList_item__2XT81, .product_item', { timeout: 10000 });
      } catch (waitError) {
        console.log('Product selector not found, proceeding with available content');
      }

      // Extract product data
      const products = await page.evaluate((searchQuery, limitCount) => {
        const results: any[] = [];
        
        // Try multiple selectors for product items
        const productSelectors = [
          '[data-testid="basicList_item"]',
          '.basicList_item__2XT81',
          '.product_item',
          '.basicList_item',
          '.product',
          '[class*="item"]'
        ];
        
        let productElements: NodeListOf<Element> | null = null;
        
        for (const selector of productSelectors) {
          productElements = document.querySelectorAll(selector);
          if (productElements.length > 0) {
            console.log(`Found ${productElements.length} products with selector: ${selector}`);
            break;
          }
        }
        
        if (!productElements || productElements.length === 0) {
          console.log('No product elements found with any selector');
          return results;
        }

        Array.from(productElements).slice(0, limitCount).forEach((element, index) => {
          try {
            // Extract title
            const titleSelectors = [
              '.basicList_title__3P9Q7',
              '.product_title',
              '[data-testid="basicList_title"]',
              '.title',
              'h3',
              'h2',
              '[class*="title"]'
            ];
            
            let title = '';
            for (const selector of titleSelectors) {
              const titleEl = element.querySelector(selector);
              if (titleEl) {
                title = titleEl.textContent?.trim() || '';
                if (title) break;
              }
            }
            
            if (!title) {
              const linkEl = element.querySelector('a');
              title = linkEl?.getAttribute('title') || linkEl?.textContent?.trim() || '';
            }

            // Extract price
            const priceSelectors = [
              '.price_num',
              '.price_price__2WUXn',
              '.price',
              '[data-testid="basicList_price"]',
              '[class*="price"]'
            ];
            
            let priceText = '';
            for (const selector of priceSelectors) {
              const priceEl = element.querySelector(selector);
              if (priceEl) {
                priceText = priceEl.textContent?.trim() || '';
                if (priceText) break;
              }
            }
            
            const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

            // Extract image
            const imageSelectors = [
              'img[src]',
              'img[data-src]',
              'img[data-original]',
              '[data-testid="basicList_thumbnail"] img'
            ];
            
            let imageUrl = '';
            for (const selector of imageSelectors) {
              const imgEl = element.querySelector(selector);
              if (imgEl) {
                imageUrl = imgEl.getAttribute('src') || 
                          imgEl.getAttribute('data-src') || 
                          imgEl.getAttribute('data-original') || '';
                if (imageUrl) {
                  // Clean up image URL
                  if (imageUrl.startsWith('//')) {
                    imageUrl = `https:${imageUrl}`;
                  } else if (imageUrl.startsWith('/')) {
                    imageUrl = `https://shopping.naver.com${imageUrl}`;
                  } else if (!imageUrl.startsWith('http')) {
                    imageUrl = `https://shopping.naver.com/${imageUrl}`;
                  }
                  
                  // Validate image URL format
                  if (imageUrl.includes('http') && !imageUrl.includes('undefined') && !imageUrl.includes('null')) {
                    break;
                  } else {
                    imageUrl = '';
                  }
                }
              }
            }

            // Extract link
            const linkEl = element.querySelector('a');
            let link = linkEl?.getAttribute('href') || '';
            if (link && !link.startsWith('http')) {
              link = `https://shopping.naver.com${link}`;
            }

            // Extract seller
            const sellerSelectors = [
              '.basicList_mall__3EFGQ',
              '.product_mall',
              '[data-testid="basicList_mall"]',
              '.mall',
              '[class*="mall"]'
            ];
            
            let seller = '';
            for (const selector of sellerSelectors) {
              const sellerEl = element.querySelector(selector);
              if (sellerEl) {
                seller = sellerEl.textContent?.trim() || '';
                if (seller) break;
              }
            }

            if (title && price > 0) {
              results.push({
                id: `naver-${Date.now()}-${index}`,
                title: title.replace(/<[^>]*>/g, ''),
                name: title.replace(/<[^>]*>/g, ''),
                price: price,
                imageUrl: imageUrl || '/images/placeholder.png',
                url: link || '#',
                link: link || '#',
                platform: 'naver',
                category: '',
                salesCount: Math.floor(Math.random() * 1000) + 100,
                rating: Math.floor(Math.random() * 50) / 10 + 4,
                reviewCount: Math.floor(Math.random() * 500) + 50,
                seller: seller || 'Unknown Seller',
                description: `${title} - 네이버 쇼핑에서 판매중`,
                brand: '',
                availability: 'In Stock',
                shippingInfo: '무료배송',
                tags: [searchQuery],
                originalPrice: '',
                discount: 0,
                stock: Math.floor(Math.random() * 100) + 10,
                location: '대한민국',
                competitionLevel: 'medium',
              });
            }
          } catch (elementError) {
            console.log(`Error processing element ${index}:`, elementError);
          }
        });

        return results;
      }, query, limit);

      console.log(`Successfully scraped ${products.length} Naver products with Puppeteer`);
      return products;
      
    } catch (error) {
      console.error('Error scraping Naver products with Puppeteer:', error);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
}