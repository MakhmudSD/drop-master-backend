# fetchProducts GraphQL Query Examples

## New Multi-Platform Product Fetching

### Query Definition
```graphql
fetchProducts(platform: String!, queries: [String!]!): [SimpleProduct!]!

type SimpleProduct {
  title: String!
  link: String!
}
```

### Example Queries

#### 1. Naver Platform (Uses Real API)
```graphql
{
  fetchProducts(platform: "naver", queries: ["스마트폰", "노트북"]) {
    title
    link
  }
}
```

#### 2. Coupang Platform (Fallback Data)
```graphql
{
  fetchProducts(platform: "coupang", queries: ["electronics"]) {
    title
    link
  }
}
```

#### 3. AliExpress Platform (Fallback Data)
```graphql
{
  fetchProducts(platform: "aliexpress", queries: ["gadgets", "accessories"]) {
    title
    link
  }
}
```

#### 4. 11st Platform (Fallback Data)
```graphql
{
  fetchProducts(platform: "11st", queries: ["fashion", "home"]) {
    title
    link
  }
}
```

#### 5. Multiple Queries Example
```graphql
{
  fetchProducts(platform: "naver", queries: ["iPhone", "갤럭시", "아이패드"]) {
    title
    link
  }
}
```

## API Configuration

### Naver Blog API
- **Endpoint**: `https://openapi.naver.com/v1/search/blog`
- **Client ID**: `YOUR_NAVER_CLIENT_ID`
- **Client Secret**: `YOUR_NAVER_CLIENT_SECRET`
- **Headers**: 
  - `X-Naver-Client-Id`: Client ID
  - `X-Naver-Client-Secret`: Client Secret
  - `Content-Type`: text/plain
- **Parameters**:
  - `query`: Search term
  - `display`: 20 (max results per query)
  - `start`: 1 (start index)
  - `sort`: sim (similarity sort)

## Expected Behavior

1. **Naver Platform**: 
   - Calls Naver Blog API for each query
   - Returns up to 20 results per query
   - Falls back to fallback data if API fails
   - HTML tags are cleaned from titles

2. **Other Platforms**: 
   - Always returns fallback data (20 unique products each)
   - Queries parameter is ignored for non-Naver platforms

3. **Error Handling**: 
   - Graceful error handling with logging
   - Always returns fallback data on API failures
   - Async/await properly implemented

4. **Multiple Queries**: 
   - Loops through all queries in the array
   - Combines results from all queries
   - Each query limited to 20 results

## Testing Steps

1. Start the backend: `npm run start:dev`
2. Open GraphQL Playground: `http://localhost:3000/graphql`
3. Test each platform with different queries
4. Verify Naver calls real API, others return fallback
5. Test error scenarios (invalid queries, network issues)

## Implementation Details

- **Service**: `MultiPlatformProductsService`
- **Resolver**: `MultiPlatformProductsResolver`
- **Type**: `SimpleProduct` (title, link only)
- **Fallback**: 20 unique products per platform
- **Logging**: Comprehensive error and info logging
- **Clean Code**: Proper async/await, error handling, type safety
