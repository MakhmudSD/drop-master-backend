# ScraperApiService Documentation

This document describes the Puppeteer-based ScraperApiService integration for your NestJS dropshipping platform.

## Overview

The ScraperApiService provides a unified interface for scraping products from multiple e-commerce platforms using Puppeteer for direct web scraping. It supports Coupang, Naver, 11st, AliExpress, and Alibaba with real browser automation.

## Features

- **Puppeteer Integration**: Real browser automation for dynamic content
- **Unified API Interface**: Single service for all supported platforms
- **Direct Web Scraping**: No external API dependencies
- **Error Handling**: Comprehensive error handling and logging
- **Type Safety**: Full TypeScript support with interfaces
- **Health Monitoring**: Built-in health checks and status monitoring
- **Resource Optimization**: Blocks unnecessary resources for faster scraping
- **Flexible Configuration**: Environment-based configuration

## Configuration

Add these environment variables to your `.env` file:

```env
# Puppeteer Configuration
PUPPETEER_HEADLESS=true
PUPPETEER_TIMEOUT=30000
```

## API Endpoints

### POST /api/scraper-api/scrape
Scrape products using a flexible request format.

**Request Body:**
```json
{
  "platform": "coupang",
  "keywords": ["인기상품", "베스트셀러"],
  "maxResults": 20,
  "category": "electronics",
  "sortBy": "popularity",
  "page": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "products": [...],
    "totalCount": 20,
    "platform": "coupang",
    "scrapedAt": "2024-01-15T10:30:00.000Z",
    "metadata": {
      "keywords": ["인기상품", "베스트셀러"],
      "searchQuery": "인기상품 베스트셀러",
      "filters": {}
    }
  }
}
```

### GET /api/scraper-api/coupang
Scrape Coupang products with query parameters.

**Query Parameters:**
- `keywords`: Comma-separated keywords (optional)
- `maxResults`: Number of results (default: 20)
- `page`: Page number (default: 1)

**Example:**
```
GET /api/scraper-api/coupang?keywords=에어팟,무선이어폰&maxResults=10&page=1
```

### GET /api/scraper-api/naver
Scrape Naver products with query parameters.

### GET /api/scraper-api/11st
Scrape 11st products with query parameters.

### GET /api/scraper-api/aliexpress
Scrape AliExpress products with query parameters.

### GET /api/scraper-api/alibaba
Scrape Alibaba products with query parameters.

### GET /api/scraper-api/health
Check the health status of the scraper API.

**Response:**
```json
{
  "success": true,
  "healthy": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### GET /api/scraper-api/status
Get detailed API status and limits.

**Response:**
```json
{
  "success": true,
  "status": {
    "rateLimit": {
      "remaining": 950,
      "reset": "2024-01-15T11:00:00.000Z"
    },
    "quota": {
      "used": 50,
      "limit": 1000
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Data Models

### ScrapingRequest
```typescript
interface ScrapingRequest {
  platform: 'coupang' | 'naver' | '11st' | 'aliexpress' | 'alibaba';
  keywords?: string[];
  maxResults?: number;
  category?: string;
  sortBy?: 'popularity' | 'price' | 'rating' | 'newest';
  page?: number;
}
```

### ScrapedProduct
```typescript
interface ScrapedProduct {
  id: string;
  title: string;
  name?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageUrls?: string[];
  url: string;
  platform: string;
  category?: string;
  salesCount?: number;
  rating?: number;
  reviewCount?: number;
  growthRate?: number;
  estimatedMargin?: number;
  description?: string;
  brand?: string;
  availability?: string;
  shippingInfo?: string;
  tags?: string[];
}
```

### ScrapingResponse
```typescript
interface ScrapingResponse {
  success: boolean;
  products: ScrapedProduct[];
  totalCount: number;
  platform: string;
  scrapedAt: string;
  metadata?: {
    keywords?: string[];
    searchQuery?: string;
    filters?: Record<string, any>;
  };
}
```

## Usage Examples

### 1. Scrape Coupang Products
```bash
curl -X GET "http://localhost:3001/api/scraper-api/coupang?keywords=에어팟,무선이어폰&maxResults=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Scrape AliExpress Products
```bash
curl -X GET "http://localhost:3001/api/scraper-api/aliexpress?keywords=wireless,headphones&maxResults=15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Custom Scraping Request
```bash
curl -X POST http://localhost:3001/api/scraper-api/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "platform": "naver",
    "keywords": ["스마트폰", "케이스"],
    "maxResults": 20,
    "category": "electronics",
    "sortBy": "price",
    "page": 1
  }'
```

### 4. Health Check
```bash
curl -X GET http://localhost:3001/api/scraper-api/health \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Service Methods

### Public Methods

#### `scrapeProducts(request: ScrapingRequest): Promise<ScrapingResponse>`
Main method for scraping products with full configuration using Puppeteer.

#### `scrapeCoupangProducts(keywords: string[], maxResults: number, page: number): Promise<ScrapedProduct[]>`
Real Puppeteer-based Coupang scraping with dynamic content handling.

#### `scrapeNaverProducts(keywords: string[], maxResults: number, page: number): Promise<ScrapedProduct[]>`
Real Puppeteer-based Naver scraping with dynamic content handling.

#### `scrape11stProducts(keywords: string[], maxResults: number, page: number): Promise<ScrapedProduct[]>`
Real Puppeteer-based 11st scraping with dynamic content handling.

#### `scrapeAliExpressProducts(keywords: string[], maxResults: number, page: number): Promise<ScrapedProduct[]>`
Real Puppeteer-based AliExpress scraping with dynamic content handling.

#### `scrapeAlibabaProducts(keywords: string[], maxResults: number, page: number): Promise<ScrapedProduct[]>`
Real Puppeteer-based Alibaba scraping with dynamic content handling.

#### `healthCheck(): Promise<boolean>`
Check if the Puppeteer browser is healthy and responsive.

#### `getApiStatus(): Promise<any>`
Get detailed browser status and configuration information.

## Error Handling

The service includes comprehensive error handling:

- **Puppeteer Errors**: Browser initialization and navigation error handling
- **Network Timeouts**: Configurable timeout handling for page loads
- **Selector Failures**: Graceful handling when CSS selectors don't match
- **Data Validation**: Input validation and sanitization
- **Resource Management**: Proper page cleanup and browser management
- **Logging**: Detailed scraping process logging

## Integration with Existing System

The ScraperApiService integrates seamlessly with your existing scraping system:

1. **Enhanced Scraper Service**: Can be used as a fallback or alternative
2. **Products Service**: Can save scraped products to your database
3. **Authentication**: Uses your existing JWT authentication
4. **Error Handling**: Consistent with your error handling patterns

## Testing

You can test the service using the provided endpoints or integrate it with your existing test suite. The service includes health checks and status monitoring for easy debugging.

## Performance Considerations

- **Resource Blocking**: Blocks images, CSS, and fonts for faster loading
- **Timeout Handling**: Configurable timeouts to prevent hanging requests
- **Browser Management**: Efficient browser instance management
- **Memory Management**: Proper page cleanup and garbage collection
- **Concurrent Scraping**: Can handle multiple scraping requests simultaneously

## Security

- **Browser Security**: Sandboxed browser instances for safe scraping
- **Request Validation**: Input sanitization and validation
- **Error Sanitization**: Safe error messages without sensitive data
- **Authentication**: Integration with your JWT authentication system
- **Resource Isolation**: Each scraping request runs in its own browser context

This service provides a robust foundation for scraping products from multiple e-commerce platforms while maintaining consistency with your existing codebase architecture.
