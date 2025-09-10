import { IsString, IsEnum, IsUrl, IsOptional } from 'class-validator';

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
  success: boolean;
  product?: {
    source: string;
    url: string;
    title: string;
    price: number;
    image: string;
    stock: string;
    lastUpdated: Date;
  };
  error?: string;
}
