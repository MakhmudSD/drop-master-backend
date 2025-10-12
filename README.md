# Drop Master Backend

A powerful NestJS-based backend API for automated dropshipping platform, supporting multi-platform product sourcing, cart management, and order processing.

## 🚀 Features

- **Multi-Platform Product Sourcing**: Fetch products from Naver, Coupang, 11st, AliExpress, and Alibaba
- **Web Scraping**: Advanced Puppeteer-based scraping for platforms without public APIs
- **Dual API Support**: Both GraphQL (Apollo Server) and REST endpoints
- **Authentication**: JWT-based auth with OAuth2 (Google, Kakao, Naver)
- **AI Translation**: OpenAI integration for automatic Korean translation
- **Cart Management**: Complete shopping cart functionality
- **Order Management**: Track and manage orders
- **Automation**: Scheduled tasks for product sync and price updates
- **MongoDB**: Database with Mongoose ODM

## 📋 Prerequisites

- Node.js v18 or higher
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file with your credentials:

```env
# Database - REQUIRED
# Option 1: Local MongoDB
MONGO_URL=mongodb://localhost:27017/drop-master

# Option 2: MongoDB Atlas (recommended for production)
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/drop-master

# JWT Secret - REQUIRED
# Generate with: openssl rand -hex 32
JWT_SECRET=your_generated_secret_here
JWT_EXPIRES_IN=7d

# OpenAI API - REQUIRED for translation
# Get from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-...

# Session Secret - REQUIRED
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# Social Login - OPTIONAL (at least one recommended)
# Google: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Kakao: https://developers.kakao.com/
KAKAO_CLIENT_ID=your_client_id
KAKAO_CLIENT_SECRET=your_client_secret
KAKAO_CALLBACK_URL=http://localhost:3001/api/auth/kakao/callback

# Naver: https://developers.naver.com/
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
NAVER_CALLBACK_URL=http://localhost:3001/api/auth/naver/callback

# Shopping Platform APIs - OPTIONAL
NAVER_SHOPPING_API_KEY=your_naver_api_key
NAVER_SHOPPING_API_SECRET=your_naver_api_secret
COUPANG_API_KEY=your_coupang_api_key
ELEVENST_API_KEY=your_11st_api_key
```

### 4. Start MongoDB

**Local MongoDB:**
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud database)

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

Server will start at: `http://localhost:3001`

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🔗 API Endpoints

### REST API
- Base URL: `http://localhost:3001/api`
- Health Check: `GET /api/health`
- Root: `GET /api` - Returns API info

### GraphQL API
- Playground: `http://localhost:3001/graphql`
- Endpoint: `http://localhost:3001/graphql`

### Key REST Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires JWT)
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/kakao` - Kakao OAuth
- `GET /api/auth/naver` - Naver OAuth

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/popular` - Get popular products by platform
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status

#### Scraping
- `POST /api/scraping/scrape` - Scrape product from URL
- `POST /api/scraping/naver` - Scrape Naver Shopping products

### GraphQL Queries & Mutations

See `graphql-examples.md` and `fetchProducts-examples.md` for detailed examples.

**Popular Queries:**
```graphql
# Get popular products
query {
  popularProducts(platform: "naver", limit: 20, query: "인기상품") {
    id
    title
    price
    imageUrl
    platform
  }
}

# Get cart items
query {
  cartItems {
    id
    productName
    price
    quantity
  }
}
```

## 📦 Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts           # Root module
├── config/                 # Configuration files
├── modules/                # Feature modules
│   ├── auth/              # Authentication & OAuth
│   ├── products/          # Product management
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order management
│   ├── scraping/          # Web scraping
│   ├── automation/        # Automation tasks
│   └── users/             # User management
├── schemas/               # MongoDB schemas
├── libs/                  # Shared libraries
│   ├── dto/              # Data Transfer Objects
│   ├── strategies/       # Passport strategies
│   └── interceptors/     # Custom interceptors
└── graphql/              # GraphQL types and inputs
```

## 🔧 Technology Stack

- **NestJS** - Progressive Node.js framework
- **MongoDB & Mongoose** - Database and ODM
- **Apollo Server** - GraphQL server
- **Passport** - Authentication (JWT, Google, Kakao, Naver)
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing
- **OpenAI** - AI translation
- **Axios** - HTTP client
- **class-validator** - Input validation

## 🎯 API Integration

### Current Status

- ✅ **Naver Shopping**: Puppeteer scraping implemented, ready for real API
- ✅ **Cart**: Full CRUD operations via GraphQL
- ✅ **Authentication**: JWT + OAuth2 working
- ⏳ **Coupang, 11st, AliExpress**: Using fallback data, ready for API integration

### Adding Real API Credentials

When platform APIs become available:

1. Add API keys to `.env` file
2. Backend automatically switches from scraping/fallback to real API
3. Graceful degradation if API fails

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

## 📝 Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format
```

## 🐛 Debugging

The application includes comprehensive logging:
- Request/response logging
- Error tracking with stack traces
- API call monitoring
- Database operation logs

Check console output for detailed debugging information.

## 🔒 Security Features

- JWT-based authentication with configurable expiration
- Password hashing with bcryptjs
- OAuth2 social login integration
- CORS configuration for frontend
- Input validation with class-validator
- Environment variable protection

## 🚀 Deployment

### Production Checklist

1. Set `NODE_ENV=production` in `.env`
2. Use strong JWT_SECRET (32+ characters)
3. Use MongoDB Atlas for database
4. Configure proper CORS origins
5. Enable HTTPS
6. Set up proper error logging

### Environment Variables for Production

Update these for production deployment:
- `MONGO_URL` - MongoDB Atlas connection string
- `FRONTEND_URL` - Your production frontend URL
- `JWT_SECRET` - Strong secret key
- OAuth callback URLs - Update to production URLs

## 📚 Additional Documentation

- `graphql-examples.md` - GraphQL query examples
- `fetchProducts-examples.md` - Multi-platform product fetching examples
- `.env.example` - Environment variables template

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB is running: `mongod --version`
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

### OAuth Login Not Working
- Verify callback URLs match in OAuth provider settings
- Check client ID and secret are correct
- Ensure frontend URL is correctly configured

### Port Already in Use
- Change PORT in `.env` to a different port
- Or kill the process: `lsof -ti:3001 | xargs kill`

### GraphQL Errors
- Check `http://localhost:3001/graphql` for detailed errors
- Verify JWT token is being sent in Authorization header
- Check user is authenticated for protected queries

## 📄 License

UNLICENSED - Private Project

## 🤝 Contributing

1. Follow NestJS best practices
2. Write tests for new features
3. Update documentation
4. Use TypeScript strict mode

## 📞 Support

For issues:
1. Check server logs for errors
2. Test endpoints in GraphQL Playground
3. Verify environment variables are set correctly
4. Check MongoDB connection

Server is running successfully when you see:
```
🚀 Server running on http://localhost:3001
📊 API Documentation: http://localhost:3001/api
🌐 Frontend URL: http://localhost:3000
```
