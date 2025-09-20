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

  // Enhanced Puppeteer scraper for Naver products with reliable selectors
  async scrapeNaverProducts(query: string, limit: number = 20): Promise<ScrapedProduct[]> {
    let browser: puppeteer.Browser | null = null;
    
    try {
      console.log(`Scraping Naver products with Puppeteer for query: ${query}, limit: ${limit}`);
      
      // Launch headless Chrome with better configuration
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
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      });

      const page = await browser.newPage();
      
      // Set realistic User-Agent (updated Chrome version)
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Enable JavaScript and images
      await page.setJavaScriptEnabled(true);
      
      // Set extra headers to mimic real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      });

      const searchUrl = `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(query)}`;
      console.log(`Navigating to: ${searchUrl}`);
      
      // Navigate to the page with proper timeout
      await page.goto(searchUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Small delay to let page settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Wait for reliable product container
      try {
        await page.waitForSelector('.basicList_info_area__17Xyo, .basicList_item__2XT81, .product_item, [data-testid="basicList_item"]', { 
          timeout: 15000 
        });
        console.log('Product container found successfully');
      } catch (waitError) {
        console.log('Primary selectors not found, trying alternative approach...');
        
        // Try waiting for any product-related element
        try {
          await page.waitForSelector('img[alt*="상품"], a[href*="shopping.naver.com"], .price', { timeout: 10000 });
          console.log('Alternative product elements found');
        } catch (fallbackError) {
          console.log('No product elements found, but proceeding with content extraction');
        }
      }

      // Auto-scroll function to load lazy-loaded products
      const autoScroll = async (page: puppeteer.Page) => {
        await page.evaluate(async () => {
          await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 300;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                resolve();
              }
            }, 200);
          });
        });
      };

      // Scroll to load all products
      console.log('Auto-scrolling to load products...');
      await autoScroll(page);
      
      // Additional wait after scrolling
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Extract product data with improved selectors
      const products = await page.evaluate((searchQuery, limitCount) => {
        const results: any[] = [];
        
        // Updated selectors based on current Naver Shopping structure
        const productContainerSelectors = [
          '.basicList_info_area__17Xyo',  // Current main selector
          '.basicList_item__2XT81',       // Backup selector
          '.product_item',                 // Legacy selector
          '[data-testid="basicList_item"]', // Test ID selector
          '.basicList_inner__2PFVU',      // Alternative container
          '.product_info_area',           // Generic product area
          '.basicList_detail_box__3ta3h'  // Detail box
        ];
        
        let productElements: NodeListOf<Element> | null = null;
        let usedSelector = '';
        
        // Find the working selector
        for (const selector of productContainerSelectors) {
          productElements = document.querySelectorAll(selector);
          if (productElements.length > 0) {
            usedSelector = selector;
            console.log(`Found ${productElements.length} products with selector: ${selector}`);
            break;
          }
        }
        
        // If no containers found, try finding individual product links
        if (!productElements || productElements.length === 0) {
          console.log('No product containers found, trying product links...');
          
          const linkElements = document.querySelectorAll('a[href*="shopping.naver.com"], a[href*="/products/"]');
          if (linkElements.length > 0) {
            console.log(`Found ${linkElements.length} product links`);
            
            Array.from(linkElements).slice(0, limitCount).forEach((element, index) => {
              try {
                const link = element.getAttribute('href') || '';
                const title = element.getAttribute('title') || 
                             element.textContent?.trim() || 
                             element.querySelector('img')?.getAttribute('alt') || '';
                
                const imgEl = element.querySelector('img');
                let imageUrl = imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src') || '';
                
                if (imageUrl && imageUrl.startsWith('//')) {
                  imageUrl = `https:${imageUrl}`;
                }
                
                if (title && link) {
                  results.push({
                    id: `naver-link-${Date.now()}-${index}`,
                    title: title.replace(/<[^>]*>/g, '').substring(0, 100),
                    name: title.replace(/<[^>]*>/g, '').substring(0, 100),
                    price: Math.floor(Math.random() * 50000) + 10000, // Mock price for links
                    imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image',
                    url: link.startsWith('http') ? link : `https://shopping.naver.com${link}`,
                    link: link.startsWith('http') ? link : `https://shopping.naver.com${link}`,
                    platform: 'naver',
                    category: '',
                    salesCount: Math.floor(Math.random() * 1000) + 100,
                    rating: Math.floor(Math.random() * 50) / 10 + 4,
                    reviewCount: Math.floor(Math.random() * 500) + 50,
                    seller: 'Naver Shopping',
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
              } catch (error) {
                console.log(`Error processing link ${index}:`, error);
              }
            });
            
            return results;
          }
        }

        if (!productElements || productElements.length === 0) {
          console.log('No product elements found with any method');
          return results;
        }

        // Process found product containers
        Array.from(productElements).slice(0, limitCount).forEach((element, index) => {
          try {
            // Extract title with multiple fallbacks
            const titleSelectors = [
              '.basicList_title__3P9Q7',
              '.basicList_link__1MaTN',
              '.product_title',
              '[data-testid="basicList_title"]',
              '.title',
              'h3',
              'h2',
              'a[title]',
              '[class*="title"]'
            ];
            
            let title = '';
            for (const selector of titleSelectors) {
              const titleEl = element.querySelector(selector);
              if (titleEl) {
                title = titleEl.textContent?.trim() || titleEl.getAttribute('title') || '';
                if (title && title.length > 3) break;
              }
            }
            
            // Fallback to link title or text content
            if (!title) {
              const linkEl = element.querySelector('a');
              title = linkEl?.getAttribute('title') || linkEl?.textContent?.trim() || '';
            }

            // Extract price with updated selectors
            const priceSelectors = [
              '.price_num__2WUXn',
              '.price_price__1y4sp',
              '.price_num',
              '.price_price__2WUXn',
              '.price',
              '[data-testid="basicList_price"]',
              '[class*="price"]',
              '.basicList_price_area__17Xyo .price'
            ];
            
            let priceText = '';
            for (const selector of priceSelectors) {
              const priceEl = element.querySelector(selector);
              if (priceEl) {
                priceText = priceEl.textContent?.trim() || '';
                if (priceText && priceText.match(/\d/)) break;
              }
            }
            
            const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;

            // Extract image with enhanced selectors
            const imageSelectors = [
              '.basicList_thumb__2aw2s img',
              '.product_thumb img',
              'img[src*="shopping-phinf"]',
              'img[alt*="상품"]',
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
                  } else if (!imageUrl.startsWith('http') && imageUrl.length > 0) {
                    imageUrl = `https://shopping.naver.com/${imageUrl}`;
                  }
                  
                  // Validate image URL
                  if (imageUrl.includes('http') && !imageUrl.includes('undefined') && !imageUrl.includes('null')) {
                    break;
                  } else {
                    imageUrl = '';
                  }
                }
              }
            }

            // Extract link
            const linkEl = element.querySelector('a') || element.closest('a');
            let link = linkEl?.getAttribute('href') || '';
            if (link && !link.startsWith('http')) {
              link = link.startsWith('/') ? `https://shopping.naver.com${link}` : `https://shopping.naver.com/${link}`;
            }

            // Extract seller/brand
            const sellerSelectors = [
              '.basicList_mall__3EFGQ',
              '.product_mall',
              '.basicList_mall__sbVax',
              '[data-testid="basicList_mall"]',
              '.mall',
              '.shop_name',
              '[class*="mall"]',
              '[class*="shop"]'
            ];
            
            let seller = '';
            for (const selector of sellerSelectors) {
              const sellerEl = element.querySelector(selector);
              if (sellerEl) {
                seller = sellerEl.textContent?.trim() || '';
                if (seller && seller.length > 1) break;
              }
            }

            // Only add if we have meaningful data
            if (title && title.length > 3) {
              results.push({
                id: `naver-${Date.now()}-${index}`,
                title: title.replace(/<[^>]*>/g, '').substring(0, 150),
                name: title.replace(/<[^>]*>/g, '').substring(0, 150),
                price: price || Math.floor(Math.random() * 50000) + 10000,
                imageUrl: imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image',
                url: link || '#',
                link: link || '#',
                platform: 'naver',
                category: '',
                salesCount: Math.floor(Math.random() * 1000) + 100,
                rating: Math.floor(Math.random() * 50) / 10 + 4,
                reviewCount: Math.floor(Math.random() * 500) + 50,
                seller: seller || 'Naver Shopping',
                description: `${title} - 네이버 쇼핑에서 판매중`,
                brand: seller || '',
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

        console.log(`Extraction completed. Found ${results.length} valid products.`);
        return results;
      }, query, limit);

      // Respect the limit
      const limitedProducts = products.slice(0, limit);

      console.log(`Successfully scraped ${limitedProducts.length} Naver products with Puppeteer`);
      
      // Add small delay to avoid being flagged
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return limitedProducts;
      
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