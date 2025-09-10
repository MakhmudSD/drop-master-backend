import { IsString, IsArray, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class ScrapeProductsDto {
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

