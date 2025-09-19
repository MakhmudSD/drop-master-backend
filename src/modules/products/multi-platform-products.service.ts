import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface Product {
  title: string;
  link: string;
}

@Injectable()
export class MultiPlatformProductsService {
  private readonly logger = new Logger(MultiPlatformProductsService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchProducts(platform: string, queries: string[]): Promise<Product[]> {
    this.logger.log(`Fetching products for platform: ${platform}, queries: ${queries.join(', ')}`);

    const allProducts: Product[] = [];

    for (const query of queries) {
      let products: Product[] = [];

      try {
        if (platform === 'naver') {
          products = await this.fetchNaverProducts(query);
        } else {
          products = this.getFallbackProducts(platform);
        }

        // Limit to 20 products per query
        products = products.slice(0, 20);
        allProducts.push(...products);
      } catch (error) {
        this.logger.error(`Failed to fetch products for platform ${platform}, query ${query}:`, error);
        // Add fallback products for the failed query
        const fallbackProducts = this.getFallbackProducts(platform).slice(0, 20);
        allProducts.push(...fallbackProducts);
      }
    }

    return allProducts;
  }

  private async fetchNaverProducts(query: string): Promise<Product[]> {
    try {
      this.logger.log(`Fetching Naver products for query: ${query}`);

      const url = 'https://openapi.naver.com/v1/search/blog';
      const params = {
        query: query,
        display: 20,
        start: 1,
        sort: 'sim'
      };

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          headers: {
            'X-Naver-Client-Id': 'x8bMpZrsfXiYKOsSlIqS',
            'X-Naver-Client-Secret': 'eGc_MxkJjD',
            'Content-Type': 'text/plain',
          },
        }),
      );

      this.logger.log(`Naver API response status: ${response.status}`);

      if (response.data && response.data.items) {
        return response.data.items.map((item: any) => ({
          title: this.cleanHtmlTags(item.title || 'No Title'),
          link: item.link || '#',
        }));
      }

      this.logger.warn('No items found in Naver response');
      return this.getFallbackProducts('naver');
    } catch (error) {
      this.logger.error('Error fetching Naver products:', error);
      return this.getFallbackProducts('naver');
    }
  }

  private getFallbackProducts(platform: string): Product[] {
    const fallbackData = {
      naver: [
        { title: 'Fallback Naver Product 1', link: '#' },
        { title: 'Fallback Naver Product 2', link: '#' },
        { title: 'Fallback Naver Product 3', link: '#' },
        { title: 'Fallback Naver Product 4', link: '#' },
        { title: 'Fallback Naver Product 5', link: '#' },
        { title: 'Fallback Naver Product 6', link: '#' },
        { title: 'Fallback Naver Product 7', link: '#' },
        { title: 'Fallback Naver Product 8', link: '#' },
        { title: 'Fallback Naver Product 9', link: '#' },
        { title: 'Fallback Naver Product 10', link: '#' },
        { title: 'Fallback Naver Product 11', link: '#' },
        { title: 'Fallback Naver Product 12', link: '#' },
        { title: 'Fallback Naver Product 13', link: '#' },
        { title: 'Fallback Naver Product 14', link: '#' },
        { title: 'Fallback Naver Product 15', link: '#' },
        { title: 'Fallback Naver Product 16', link: '#' },
        { title: 'Fallback Naver Product 17', link: '#' },
        { title: 'Fallback Naver Product 18', link: '#' },
        { title: 'Fallback Naver Product 19', link: '#' },
        { title: 'Fallback Naver Product 20', link: '#' },
      ],
      coupang: [
        { title: 'Fallback Coupang Product 1', link: '#' },
        { title: 'Fallback Coupang Product 2', link: '#' },
        { title: 'Fallback Coupang Product 3', link: '#' },
        { title: 'Fallback Coupang Product 4', link: '#' },
        { title: 'Fallback Coupang Product 5', link: '#' },
        { title: 'Fallback Coupang Product 6', link: '#' },
        { title: 'Fallback Coupang Product 7', link: '#' },
        { title: 'Fallback Coupang Product 8', link: '#' },
        { title: 'Fallback Coupang Product 9', link: '#' },
        { title: 'Fallback Coupang Product 10', link: '#' },
        { title: 'Fallback Coupang Product 11', link: '#' },
        { title: 'Fallback Coupang Product 12', link: '#' },
        { title: 'Fallback Coupang Product 13', link: '#' },
        { title: 'Fallback Coupang Product 14', link: '#' },
        { title: 'Fallback Coupang Product 15', link: '#' },
        { title: 'Fallback Coupang Product 16', link: '#' },
        { title: 'Fallback Coupang Product 17', link: '#' },
        { title: 'Fallback Coupang Product 18', link: '#' },
        { title: 'Fallback Coupang Product 19', link: '#' },
        { title: 'Fallback Coupang Product 20', link: '#' },
      ],
      aliexpress: [
        { title: 'Fallback AliExpress Product 1', link: '#' },
        { title: 'Fallback AliExpress Product 2', link: '#' },
        { title: 'Fallback AliExpress Product 3', link: '#' },
        { title: 'Fallback AliExpress Product 4', link: '#' },
        { title: 'Fallback AliExpress Product 5', link: '#' },
        { title: 'Fallback AliExpress Product 6', link: '#' },
        { title: 'Fallback AliExpress Product 7', link: '#' },
        { title: 'Fallback AliExpress Product 8', link: '#' },
        { title: 'Fallback AliExpress Product 9', link: '#' },
        { title: 'Fallback AliExpress Product 10', link: '#' },
        { title: 'Fallback AliExpress Product 11', link: '#' },
        { title: 'Fallback AliExpress Product 12', link: '#' },
        { title: 'Fallback AliExpress Product 13', link: '#' },
        { title: 'Fallback AliExpress Product 14', link: '#' },
        { title: 'Fallback AliExpress Product 15', link: '#' },
        { title: 'Fallback AliExpress Product 16', link: '#' },
        { title: 'Fallback AliExpress Product 17', link: '#' },
        { title: 'Fallback AliExpress Product 18', link: '#' },
        { title: 'Fallback AliExpress Product 19', link: '#' },
        { title: 'Fallback AliExpress Product 20', link: '#' },
      ],
      '11st': [
        { title: 'Fallback 11st Product 1', link: '#' },
        { title: 'Fallback 11st Product 2', link: '#' },
        { title: 'Fallback 11st Product 3', link: '#' },
        { title: 'Fallback 11st Product 4', link: '#' },
        { title: 'Fallback 11st Product 5', link: '#' },
        { title: 'Fallback 11st Product 6', link: '#' },
        { title: 'Fallback 11st Product 7', link: '#' },
        { title: 'Fallback 11st Product 8', link: '#' },
        { title: 'Fallback 11st Product 9', link: '#' },
        { title: 'Fallback 11st Product 10', link: '#' },
        { title: 'Fallback 11st Product 11', link: '#' },
        { title: 'Fallback 11st Product 12', link: '#' },
        { title: 'Fallback 11st Product 13', link: '#' },
        { title: 'Fallback 11st Product 14', link: '#' },
        { title: 'Fallback 11st Product 15', link: '#' },
        { title: 'Fallback 11st Product 16', link: '#' },
        { title: 'Fallback 11st Product 17', link: '#' },
        { title: 'Fallback 11st Product 18', link: '#' },
        { title: 'Fallback 11st Product 19', link: '#' },
        { title: 'Fallback 11st Product 20', link: '#' },
      ],
    };

    return fallbackData[platform] || fallbackData.naver;
  }

  private cleanHtmlTags(text: string): string {
    return text.replace(/<[^>]*>/g, '').trim();
  }
}
