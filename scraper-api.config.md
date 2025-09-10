# Scraper API Configuration

## Environment Variables

Add these environment variables to your `.env` file:

```env
# Scraper API Integration
SCRAPER_API_URL=https://api.scraper.com
SCRAPER_API_KEY=your-scraper-api-key-here
SCRAPER_API_TIMEOUT=30000
```

## Configuration

The ScraperApiService is designed to work with any REST API that provides product scraping services. 

### Required Configuration:

1. **SCRAPER_API_URL**: The base URL of your scraper API
2. **SCRAPER_API_KEY**: Your API key for authentication (optional, depending on your API)

### API Endpoints Expected:

The service expects these endpoints to be available:

- `POST /scrape/coupang` - Scrape Coupang products
- `POST /scrape/naver` - Scrape Naver products  
- `POST /scrape/11st` - Scrape 11st products
- `POST /scrape/aliexpress` - Scrape AliExpress products
- `POST /scrape/alibaba` - Scrape Alibaba products
- `GET /health` - Health check endpoint
- `GET /status` - API status and limits

### Request Format:

```json
{
  "platform": "coupang",
  "keywords": ["인기상품", "베스트셀러"],
  "maxResults": 20,
  "category": "electronics",
  "sortBy": "popularity",
  "options": {
    "includeImages": true,
    "includeReviews": true,
    "includePricing": true,
    "includeAvailability": true
  }
}
```

### Response Format:

```json
{
  "success": true,
  "products": [
    {
      "id": "product_123",
      "title": "Product Name",
      "name": "Product Name",
      "price": 29900,
      "originalPrice": 39900,
      "imageUrl": "https://example.com/image.jpg",
      "imageUrls": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      "url": "https://example.com/product/123",
      "platform": "coupang",
      "category": "electronics",
      "salesCount": 1250,
      "rating": 4.5,
      "reviewCount": 89,
      "growthRate": 15.2,
      "estimatedMargin": 25.5,
      "description": "Product description",
      "brand": "Brand Name",
      "availability": "In Stock",
      "shippingInfo": "Free shipping",
      "tags": ["popular", "bestseller"]
    }
  ],
  "totalCount": 20,
  "platform": "coupang",
  "scrapedAt": "2025-09-08T14:00:00.000Z",
  "metadata": {
    "keywords": ["인기상품", "베스트셀러"],
    "searchQuery": "인기상품 베스트셀러",
    "filters": {}
  }
}
```

## Usage

Once configured, the service will automatically:

1. Use the scraper API for all product scraping operations
2. Fall back to demo data if the API is unavailable
3. Handle errors gracefully
4. Transform responses to a consistent format

## Testing

You can test the scraper API service by:

1. Making sure the environment variables are set
2. Starting the backend server
3. Making requests to `/api/products/popular?platform=coupang&limit=20`
4. Checking the logs for scraper API calls

## Customization

If your scraper API has a different format, you can modify the `ScraperApiService` class:

1. Update the `getEndpointForPlatform()` method for different endpoint paths
2. Update the `buildRequestPayload()` method for different request formats
3. Update the `transformResponse()` method for different response formats
