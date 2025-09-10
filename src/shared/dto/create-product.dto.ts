import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';

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

  @IsEnum(['naver', 'coupang', '11st'])
  targetPlatform: string;

  @IsEnum(['aliexpress', 'alibaba'])
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
}
