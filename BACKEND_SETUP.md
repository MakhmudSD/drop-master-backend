# Backend Setup Guide

This document explains how to set up and run the Drop Master backend server.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URL=mongodb://localhost:27017/dropmaster

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth Provider Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

KAKAO_CLIENT_ID=your_kakao_client_id_here
KAKAO_CLIENT_SECRET=your_kakao_client_secret_here
KAKAO_CALLBACK_URL=http://localhost:3001/api/auth/kakao/callback

NAVER_CLIENT_ID=your_naver_client_id_here
NAVER_CLIENT_SECRET=your_naver_client_secret_here
NAVER_CALLBACK_URL=http://localhost:3001/api/auth/naver/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=3001

# OpenAI API (for AI translation)
OPENAI_API_KEY=your_openai_api_key_here

# Apify API (for web scraping)
APIFY_API_TOKEN=your_apify_api_token_here
```

## Fixed Issues

### ✅ Module Structure
- Fixed incorrect import paths in `app.module.ts`
- Added missing `AuthModule` import
- Corrected service and controller import paths

### ✅ Authentication System
- Created missing `JwtAuthGuard` and `JwtStrategy`
- Added `Public` decorator for public routes
- Implemented complete auth controller with:
  - `/auth/register` - User registration
  - `/auth/login` - User login
  - `/auth/profile` - Get user profile
  - `/auth/oauth-login` - Direct OAuth login
  - `/auth/unified-oauth-login` - Unified OAuth login
  - `/auth/verify-token` - Token verification
  - OAuth provider routes (Google, Kakao, Naver)

### ✅ AuthService
- Added missing `register()`, `login()`, and `getUser()` methods
- Enhanced OAuth handling with unified methods
- Proper error handling and validation

### ✅ Database Configuration
- Fixed MongoDB connection string (changed from port 3000 to 27017)
- Added proper database name (`dropmaster`)

### ✅ Import Paths
- Fixed all DTO import paths in services and controllers
- Corrected schema import paths
- Updated all relative imports to use proper paths

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/oauth-login` - OAuth login
- `POST /api/auth/unified-oauth-login` - Unified OAuth login
- `POST /api/auth/verify-token` - Verify JWT token

### OAuth Providers
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/kakao` - Kakao OAuth
- `GET /api/auth/kakao/callback` - Kakao OAuth callback
- `GET /api/auth/naver` - Naver OAuth
- `GET /api/auth/naver/callback` - Naver OAuth callback

### Products (Protected)
- `GET /api/products` - Get products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk` - Bulk operations
- `GET /api/products/stats/overview` - Get product stats

### Scraping (Protected)
- `POST /api/scrape/coupang` - Scrape Coupang
- `POST /api/scrape/naver` - Scrape Naver
- `POST /api/scrape/11st` - Scrape 11st
- `POST /api/scrape/aliexpress` - Scrape AliExpress
- `POST /api/scrape/alibaba` - Scrape Alibaba
- `GET /api/scrape/status/:runId` - Get scraping status
- `GET /api/scrape/results/:runId` - Get scraping results
- `POST /api/scrape/process/:runId` - Process scraping results
- `GET /api/scrape/history` - Get scraping history
- `POST /api/scrape/stop/:runId` - Stop scraping

## Running the Server

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file)

3. Start the development server:
```bash
npm run start:dev
```

The server will run on `http://localhost:3001` by default.

## Database Setup

Make sure MongoDB is running on your system. The application will connect to `mongodb://localhost:27017/dropmaster` by default.

## Features Implemented

- ✅ Complete authentication system with JWT
- ✅ OAuth integration (Google, Kakao, Naver)
- ✅ User registration and login
- ✅ Protected routes with JWT guards
- ✅ Product management system
- ✅ Web scraping functionality
- ✅ Cart and order management
- ✅ Automation features
- ✅ AI translation service
- ✅ Proper error handling and validation
- ✅ CORS configuration for frontend integration
