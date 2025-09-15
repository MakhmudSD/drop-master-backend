import { IsString, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class ProductDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  salesCount?: number;

  @IsOptional()
  @IsNumber()
  growthRate?: number;

  @IsOptional()
  @IsNumber()
  estimatedMargin?: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  platform: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsNumber()
  reviewCount?: number;

  @IsOptional()
  @IsString()
  shippingInfo?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  originalPrice?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  seller?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsString()
  competitionLevel?: string;

  @IsOptional()
  @IsNumber()
  alibabaPrice?: number;
}

export class PopularProductsInputDto {
  @IsString()
  platform: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

export class ProductInputDto {
  @IsString()
  id: string;
}

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  priceKRW: number;

  @IsNumber()
  sourcePrice: number;

  @IsNumber()
  marginRate: number;

  @IsString()
  category: string;

  @IsString()
  targetPlatform: string;

  @IsString()
  sourcePlatform: string;

  @IsString()
  sourceUrl: string;

  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  salesCount?: number;

  @IsOptional()
  @IsNumber()
  growthRate?: number;

  @IsOptional()
  @IsString()
  competitionLevel?: string;

  @IsOptional()
  @IsString()
  descriptionKorean?: string;

  // Additional fields for compatibility
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  brand?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
