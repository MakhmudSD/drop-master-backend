import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import { Product, ProductDocument } from '../../shared/schemas/product.schema';
import { ScrapeProductDto } from '../../shared/dto/scrape-product.dto';

export interface ScrapedProductData {
  source: string;
  url: string;
  title: string;
  price: number;
  image: string;
  stock: string;
  lastUpdated: Date;
}

@Injectable()
export class EnhancedScraperService {
  private readonly logger = new Logger(EnhancedScraperService.name);
  private browser: puppeteer.Browser | null = null;

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Puppeteer browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
      ],
    });
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async scrapeProduct(url: string, source: string): Promise<ScrapedProductData> {
    this.logger.log(`Scraping product from ${source}: ${url}`);
    
    try {
      switch (source) {
        case 'coupang':
          return await this.scrapeCoupangProduct(url);
        case 'aliexpress':
          return await this.scrapeAliExpressProduct(url);
        case 'naver':
          return await this.scrapeNaverProduct(url);
        case '11bunker':
          return await this.scrape11BunkerProduct(url);
        case 'alibaba':
          return await this.scrapeAlibabaProduct(url);
        default:
          throw new Error(`Unsupported source: ${source}`);
      }
    } catch (error) {
      this.logger.error(`Error scraping ${source} product:`, error);
      throw error;
    }
  }

  async updateAllProducts(): Promise<void> {
    this.logger.log('Starting bulk product update...');
    
    try {
      const products = await this.productModel.find({
        source: { $in: ['coupang', 'aliexpress', 'naver', '11bunker', 'alibaba'] }
      }).limit(100); // Process in batches to avoid memory issues

      let updatedCount = 0;
      let errorCount = 0;

      for (const product of products) {
        try {
          const scrapedData = await this.scrapeProduct(product.url, product.source);
          
          await this.productModel.findByIdAndUpdate(product._id, {
            $set: {
              title: scrapedData.title,
              price: scrapedData.price,
              image: scrapedData.image,
              stock: scrapedData.stock,
              lastUpdated: scrapedData.lastUpdated,
            }
          });

          updatedCount++;
          this.logger.log(`Updated product: ${product.title}`);
          
          // Add delay to avoid being blocked
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (error) {
          errorCount++;
          this.logger.error(`Failed to update product ${product._id}:`, error);
        }
      }

      this.logger.log(`Bulk update completed. Updated: ${updatedCount}, Errors: ${errorCount}`);
    } catch (error) {
      this.logger.error('Bulk update failed:', error);
      throw error;
    }
  }

  @Cron('0 */15 * * * *') // Every 15 minutes
  async handleCronUpdate() {
    this.logger.log('Running scheduled product update...');
    try {
      await this.updateAllProducts();
    } catch (error) {
      this.logger.error('Scheduled update failed:', error);
    }
  }

  // Coupang scraper with Puppeteer
  private async scrapeCoupangProduct(url: string): Promise<ScrapedProductData> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();
    
    try {
      // Set realistic browser settings
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Set extra headers to appear more like a real browser
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      });

      this.logger.log(`Navigating to Coupang: ${url}`);
      
      // Navigate with retry logic
      let retries = 3;
      while (retries > 0) {
        try {
          await page.goto(url, { 
            waitUntil: 'networkidle2', 
            timeout: 30000 
          });
          break;
        } catch (error) {
          retries--;
          if (retries === 0) throw error;
          this.logger.warn(`Navigation failed, retrying... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Wait for product details to load with multiple selector attempts
      const selectors = [
        '.prod-buy-header__title',
        '.prod-buy-header .title',
        '.product-title',
        'h1'
      ];

      let titleElement: puppeteer.ElementHandle<Element> | null = null;
      for (const selector of selectors) {
        try {
          await page.waitForSelector(selector, { timeout: 5000 });
          titleElement = await page.$(selector);
          if (titleElement) break;
        } catch (error) {
          continue;
        }
      }

      if (!titleElement) {
        throw new Error('Could not find product title element');
      }

      const productData = await page.evaluate(() => {
        // Try multiple selectors for each field
        const getTextContent = (selectors: string[]): string | null => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent?.trim()) {
              return element.textContent.trim();
            }
          }
          return null;
        };

        const getAttribute = (selectors: string[], attr: string): string | null => {
          for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.getAttribute(attr)) {
              return element.getAttribute(attr);
            }
          }
          return null;
        };

        const titleSelectors = [
          '.prod-buy-header__title',
          '.prod-buy-header .title',
          '.product-title',
          'h1'
        ];

        const priceSelectors = [
          '.total-price strong',
          '.total-price .price-value',
          '.price-value',
          '.price strong',
          '.prod-price .price-value'
        ];

        const imageSelectors = [
          '.prod-image__detail img',
          '.prod-image img',
          '.product-image img',
          '.main-image img'
        ];

        const stockSelectors = [
          '.prod-buy-buttons .prod-buy-btn',
          '.buy-button',
          '.add-to-cart',
          '.purchase-button'
        ];

        const title = getTextContent(titleSelectors) || 'Unknown Product';
        const priceText = getTextContent(priceSelectors) || '0';
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const image = getAttribute(imageSelectors, 'src') || '';
        const stockText = getTextContent(stockSelectors) || '';
        const stock = stockText.includes('품절') || stockText.includes('sold out') ? 'Out of Stock' : 'In Stock';

        return {
          title,
          price,
          image: image.startsWith('http') ? image : `https:${image}`,
          stock,
        };
      });

      // Validate scraped data
      if (!productData.title || productData.title === 'Unknown Product') {
        throw new Error('Failed to extract product title');
      }

      if (productData.price <= 0) {
        this.logger.warn('Price extraction failed, using fallback');
        productData.price = 10000; // Fallback price
      }

      this.logger.log(`Successfully scraped Coupang product: ${productData.title}`);

      return {
        source: 'coupang',
        url,
        title: productData.title,
        price: productData.price,
        image: productData.image,
        stock: productData.stock,
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error(`Coupang scraping failed for ${url}:`, error);
      throw new Error(`Failed to scrape Coupang product: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  // AliExpress placeholder scraper
  private scrapeAliExpressProduct(url: string): Promise<ScrapedProductData> {
    // Mock implementation - replace with real Puppeteer scraping
    return Promise.resolve({
      source: 'aliexpress',
      url,
      title: 'AliExpress Product (Mock)',
      price: 1500,
      image: 'https://via.placeholder.com/300x300?text=AliExpress',
      stock: 'In Stock',
      lastUpdated: new Date(),
    });
  }

  // Naver placeholder scraper
  private scrapeNaverProduct(url: string): Promise<ScrapedProductData> {
    // Mock implementation - replace with real Puppeteer scraping
    return Promise.resolve({
      source: 'naver',
      url,
      title: 'Naver Product (Mock)',
      price: 19900,
      image: 'https://via.placeholder.com/300x300?text=Naver',
      stock: 'In Stock',
      lastUpdated: new Date(),
    });
  }

  // 11Bunker placeholder scraper
  private scrape11BunkerProduct(url: string): Promise<ScrapedProductData> {
    // Mock implementation - replace with real Puppeteer scraping
    return Promise.resolve({
      source: '11bunker',
      url,
      title: '11Bunker Product (Mock)',
      price: 15000,
      image: 'https://via.placeholder.com/300x300?text=11Bunker',
      stock: 'In Stock',
      lastUpdated: new Date(),
    });
  }

  // Alibaba placeholder scraper
  private scrapeAlibabaProduct(url: string): Promise<ScrapedProductData> {
    // Mock implementation - replace with real Puppeteer scraping
    return Promise.resolve({
      source: 'alibaba',
      url,
      title: 'Alibaba Product (Mock)',
      price: 500,
      image: 'https://via.placeholder.com/300x300?text=Alibaba',
      stock: 'In Stock',
      lastUpdated: new Date(),
    });
  }
}
