import { IsString, IsEnum, IsUrl, IsOptional, IsArray, IsNumber, IsBoolean, IsObject } from 'class-validator';

export interface ScrapedProduct {
  id: string;
  title: string;
  name: string;
  price: number;
  originalPrice?: string;
  imageUrl: string;
  imageUrls?: string[];
  url: string;
  link?: string;
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
  discount?: number;
  stock?: number;
  seller?: string;
  location?: string;
  competitionLevel?: string;
}

export class ScrapeProductDto {
  @IsUrl()
  url: string;

  @IsEnum(['coupang', 'aliexpress', 'naver', '11bunker', 'alibaba'])
  source: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class ScrapeProductResponseDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsObject()
  product?: {
    source: string;
    url: string;
    title: string;
    price: number;
    image: string;
    stock: string;
    lastUpdated: Date;
  };

  @IsOptional()
  @IsString()
  error?: string;
}

export class BulkOperationsDto {
  @IsEnum(['updateStatus', 'delete'], { message: 'Action must be either updateStatus or delete' })
  action: 'updateStatus' | 'delete';

  @IsArray({ message: 'Product IDs must be an array' })
  @IsString({ each: true, message: 'Each product ID must be a string' })
  productIds: string[];

  @IsOptional()
  @IsObject()
  data?: {
    status?: string;
  };
}

export class ScrapeProductsDto {
  @IsArray()
  @IsString({ each: true })
  urls: string[];

  @IsEnum(['coupang', 'aliexpress', 'naver', '11bunker', 'alibaba'])
  source: string;

  @IsOptional()
  @IsString()
  userId?: string;

  // Additional fields from shared DTO
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsNumber()
  maxResults?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productUrls?: string[];

  @IsEnum(['naver', 'coupang', '11st', 'aliexpress', 'alibaba'])
  platform: string;
}
