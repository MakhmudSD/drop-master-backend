# Drop Master Backend

AI 기반 자동화 드롭쉬핑 플랫폼의 백엔드 서버입니다.

## 기술 스택

- **Framework**: NestJS
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **AI Translation**: OpenAI GPT-3.5
- **Web Scraping**: Apify
- **File Upload**: Multer

## 주요 기능

### 🔐 인증 시스템
- JWT 기반 사용자 인증
- 회원가입/로그인
- 프로필 관리

### 🛍️ 상품 관리
- 상품 CRUD 작업
- 실시간 상품 데이터 스크래핑
- AI 기반 상품 설명 한국어 번역
- 상품 통계 및 분석

### 🤖 자동화 시스템
- 자동 상품 발굴
- 자동 번역
- 자동 업로드 설정
- 스케줄링

### 📊 데이터 스크래핑
- 쿠팡, 네이버, 11번가 상품 스크래핑
- 알리익스프레스, 알리바바 상품 스크래핑
- 실시간 데이터 수집
- 스크래핑 히스토리 관리

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp env.example .env
```

`.env` 파일에 다음 변수들을 설정하세요:

```env
# Database
MONGO_URL=mongodb+srv://user:pass@cluster/db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# OpenAI API for translation
OPENAI_API_KEY=your-openai-api-key-here

# Apify Integration
APIFY_API_TOKEN=your-apify-token-here
APIFY_ACTOR_ID_NAVER=your-naver-actor-id
APIFY_ACTOR_ID_COUPANG=your-coupang-actor-id
APIFY_ACTOR_ID_11ST=your-11st-actor-id
APIFY_ACTOR_ID_ALIEXPRESS=your-aliexpress-actor-id
APIFY_ACTOR_ID_ALIBABA=your-alibaba-actor-id

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. 서버 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod
```

## API 엔드포인트

### 인증 (Authentication)
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/profile` - 프로필 조회
- `POST /auth/profile` - 프로필 수정

### 상품 관리 (Products)
- `GET /products` - 상품 목록 조회
- `GET /products/popular` - 인기 상품 조회
- `GET /products/:id` - 상품 상세 조회
- `POST /products` - 상품 생성
- `PATCH /products/:id` - 상품 수정
- `DELETE /products/:id` - 상품 삭제
- `POST /products/bulk` - 상품 일괄 작업
- `GET /products/stats/overview` - 상품 통계

### 스크래핑 (Scraping)
- `POST /scrape/coupang` - 쿠팡 상품 스크래핑
- `POST /scrape/naver` - 네이버 상품 스크래핑
- `POST /scrape/11st` - 11번가 상품 스크래핑
- `POST /scrape/aliexpress` - 알리익스프레스 상품 스크래핑
- `POST /scrape/alibaba` - 알리바바 상품 스크래핑
- `GET /scrape/status/:runId` - 스크래핑 상태 조회
- `GET /scrape/results/:runId` - 스크래핑 결과 조회
- `POST /scrape/process/:runId` - 스크래핑 결과 처리
- `GET /scrape/history` - 스크래핑 히스토리
- `POST /scrape/stop/:runId` - 스크래핑 중지

## 데이터베이스 스키마

### User
- `email`: 이메일 (고유)
- `name`: 이름
- `password`: 해시된 비밀번호
- `profileImage`: 프로필 이미지 URL
- `preferences`: 사용자 설정
- `role`: 사용자 역할
- `isActive`: 활성 상태

### Product
- `userId`: 사용자 ID
- `title`: 상품명
- `description`: 상품 설명 (원문)
- `descriptionKorean`: 상품 설명 (한국어 번역)
- `priceKRW`: 한국 원화 가격
- `sourcePrice`: 원가
- `marginRate`: 마진율
- `category`: 카테고리
- `targetPlatform`: 목표 플랫폼
- `sourcePlatform`: 소스 플랫폼
- `sourceUrl`: 소스 URL
- `imageUrls`: 이미지 URL 배열
- `status`: 상품 상태
- `salesCount`: 판매량
- `growthRate`: 성장률
- `competitionLevel`: 경쟁도

### Order
- `userId`: 사용자 ID
- `productId`: 상품 ID
- `productName`: 상품명
- `amount`: 주문 금액
- `customerName`: 고객명
- `customerEmail`: 고객 이메일
- `customerPhone`: 고객 전화번호
- `shippingAddress`: 배송 주소
- `sourcePlatform`: 소스 플랫폼
- `targetPlatform`: 목표 플랫폼
- `status`: 주문 상태
- `trackingNumber`: 운송장 번호

### Automation
- `userId`: 사용자 ID
- `autoSourcing`: 자동 발굴 설정
- `autoUpload`: 자동 업로드 설정
- `marginRate`: 마진율 설정
- `targetPlatforms`: 목표 플랫폼 배열
- `sourcePlatforms`: 소스 플랫폼 배열
- `selectedCategories`: 선택된 카테고리 배열
- `maxProductsPerDay`: 일일 최대 상품 수
- `minMarginRate`: 최소 마진율
- `minSalesCount`: 최소 판매량
- `isActive`: 활성 상태

## 보안

- JWT 토큰 기반 인증
- 비밀번호 해싱 (bcrypt)
- CORS 설정
- 요청 검증 (class-validator)
- Rate limiting

## 개발

### 코드 스타일
- ESLint + Prettier
- TypeScript strict mode
- NestJS best practices

### 테스트
```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e
```

## 배포

### Docker
```bash
# Docker 이미지 빌드
docker build -t drop-master-backend .

# Docker 컨테이너 실행
docker run -p 3001:3001 drop-master-backend
```

### 환경 변수
프로덕션 환경에서는 반드시 다음 환경 변수들을 설정하세요:
- `MONGO_URL`: MongoDB 연결 문자열
- `JWT_SECRET`: 강력한 JWT 시크릿
- `OPENAI_API_KEY`: OpenAI API 키
- `APIFY_API_TOKEN`: Apify API 토큰

## 라이선스

MIT License