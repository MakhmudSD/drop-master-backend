# GraphQL Playground Examples

## Popular Products Query

### Updated ProductType Schema
```graphql
type ProductType {
  id: ID!
  title: String!
  name: String!
  price: Float!
  imageUrl: String!
  link: String!
  platform: String!
  salesCount: Int
  growthRate: Float
  estimatedMargin: Float
  description: String
  brand: String
  category: String
  availability: String
  rating: Float
  reviewCount: Int
  shippingInfo: String
  tags: [String]
  specifications: String
  originalPrice: String
  discount: Float
  stock: Int
  seller: String
  location: String
  competitionLevel: String
  alibabaPrice: Float
}
```

### Basic Naver Products Query
```graphql
{
  popularProducts(platform: "naver", limit: 20) {
    id
    title
    name
    price
    imageUrl
    link
    platform
    salesCount
    growthRate
    estimatedMargin
    description
    brand
    category
    tags
    specifications
  }
}
```

### Naver Products with Search Query
```graphql
{
  popularProducts(platform: "naver", limit: 20, query: "인기상품") {
    id
    title
    name
    price
    imageUrl
    link
    platform
    salesCount
    growthRate
    estimatedMargin
  }
}
```

### Coupang Products (20 Unique Fallback Products)
```graphql
{
  popularProducts(platform: "coupang", limit: 20) {
    id
    title
    name
    price
    imageUrl
    link
    platform
    salesCount
    growthRate
    estimatedMargin
    category
    tags
    specifications
  }
}
```

### 11st Products (20 Unique Fallback Products)
```graphql
{
  popularProducts(platform: "11st", limit: 20) {
    id
    title
    name
    price
    imageUrl
    link
    platform
    salesCount
    growthRate
    estimatedMargin
    category
    tags
    specifications
  }
}
```

### AliExpress Products (20 Unique Fallback Products)
```graphql
{
  popularProducts(platform: "aliexpress", limit: 20) {
    id
    title
    name
    price
    imageUrl
    link
    platform
    salesCount
    growthRate
    estimatedMargin
    category
    tags
    specifications
  }
}
```

## Expected Behavior

1. **Naver Platform**: 
   - If ScrapingService works: Returns scraped products from Naver Shopping
   - If ScrapingService fails: Returns fallback mock data with message "Using fallback data - Naver scraping failed"

2. **Other Platforms**: 
   - Always returns fallback mock data with message "Using fallback data"

3. **Query Parameter**: 
   - For Naver: Uses the query to search Naver Shopping (defaults to "인기상품")
   - For other platforms: Ignored (fallback data is static)

## Testing Steps

1. Start the backend server: `npm run start:dev`
2. Open GraphQL Playground at `http://localhost:3000/graphql`
3. Run the queries above
4. Verify that:
   - Naver queries attempt scraping first, then fallback
   - Other platforms return fallback data immediately
   - All responses match the ProductType schema
   - Query parameter works for Naver searches

## Frontend Integration

The frontend uses these queries through Apollo Client:

```typescript
import { useProducts } from '@/hooks/useProducts';

const { products, loading, error } = useProducts({
  platform: 'naver',
  limit: 20,
  query: '인기상품'
});
```
