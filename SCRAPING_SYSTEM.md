# Enhanced Scraping System for Drop-Master

This document describes the enhanced scraping system integrated into your NestJS backend for the dropshipping platform.

## Overview

The enhanced scraping system provides:
- Real-time product scraping from multiple e-commerce sites
- Automated product updates via cron jobs
- Puppeteer-based scraping for dynamic content
- Support for Coupang, AliExpress, Naver, 11Bunker, and Alibaba

## Features

### 1. Product Schema Updates
The Product schema now includes additional fields:
```typescript
{
  source: string;        // "coupang" | "aliexpress" | "naver" | "11bunker" | "alibaba"
  url: string;           // product link
  title: string;
  price: number;
  image: string;
  stock: string;
  lastUpdated: Date;
}
```

### 2. Enhanced Scraper Service
- **scrapeProduct(url, source)**: Scrapes a single product from any supported platform
- **updateAllProducts()**: Re-scrapes all saved products and updates the database
- **Real Coupang scraper**: Uses Puppeteer for dynamic content scraping
- **Placeholder scrapers**: Mock implementations for other platforms

### 3. API Endpoints

#### POST /api/products/scrape
Scrape a single product and save it to the database.

**Request Body:**
```json
{
  "url": "https://www.coupang.com/vp/products/123456789",
  "source": "coupang"
}
```

**Response:**
```json
{
  "success": true,
  "product": {
    "source": "coupang",
    "url": "https://www.coupang.com/vp/products/123456789",
    "title": "Product Title",
    "price": 29900,
    "image": "https://thumbnail7.coupangcdn.com/...",
    "stock": "In Stock",
    "lastUpdated": "2024-01-15T10:30:00.000Z"
  },
  "savedProduct": { /* Full product object from database */ },
  "message": "Product scraped and saved successfully"
}
```

#### PUT /api/products/update
Re-scrape all stored products and update their information.

**Response:**
```json
{
  "success": true,
  "message": "All products updated successfully"
}
```

#### GET /api/products
Retrieve all saved products with pagination and filtering.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status
- `platform`: Filter by platform
- `category`: Filter by category

### 4. Automated Updates
The system includes a cron job that runs every 15 minutes to automatically update all products:
```typescript
@Cron(CronExpression.EVERY_15_MINUTES)
async handleCronUpdate() {
  await this.updateAllProducts();
}
```

## Usage Examples

### 1. Scraping a Coupang Product
```bash
curl -X POST http://localhost:3001/api/products/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.coupang.com/vp/products/123456789",
    "source": "coupang"
  }'
```

### 2. Scraping an AliExpress Product (Mock)
```bash
curl -X POST http://localhost:3001/api/products/scrape \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://www.aliexpress.com/item/123456789.html",
    "source": "aliexpress"
  }'
```

### 3. Updating All Products
```bash
curl -X PUT http://localhost:3001/api/products/update \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Getting All Products
```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=10&platform=coupang" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Implementation Details

### Coupang Scraper (Real Implementation)
The Coupang scraper uses Puppeteer to:
1. Navigate to the product page
2. Wait for dynamic content to load
3. Extract product information using CSS selectors
4. Handle stock status detection
5. Return structured product data

### Placeholder Scrapers
Other platforms (AliExpress, Naver, 11Bunker, Alibaba) currently return mock data. These can be easily replaced with real Puppeteer implementations following the same pattern as the Coupang scraper.

### Error Handling
- Network timeouts and retries
- Graceful fallback to mock data
- Comprehensive logging
- User-friendly error messages

### Performance Considerations
- Batch processing for bulk updates
- Rate limiting between requests
- Memory management for Puppeteer instances
- Database indexing for efficient queries

## Environment Variables
Make sure your `.env` file includes:
```env
MONGO_URL=mongodb://localhost:27017/dropmaster
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## Dependencies Added
- `@nestjs/schedule`: For cron job functionality
- `puppeteer`: Already installed for web scraping

## Next Steps
1. Implement real scrapers for AliExpress, Naver, 11Bunker, and Alibaba
2. Add more sophisticated error handling and retry logic
3. Implement rate limiting to avoid being blocked
4. Add product price change notifications
5. Create a web interface for managing scraping tasks

## Testing
You can test the scraping system using the provided API endpoints or by running the automated cron jobs. The system will log all scraping activities to help with debugging and monitoring.
