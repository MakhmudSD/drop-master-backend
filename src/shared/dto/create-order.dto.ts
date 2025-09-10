import { IsString, IsNumber, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class CreateOrderDto {
  @IsString({ message: 'Product ID must be a string' })
  productId: string;

  @IsString({ message: 'Product name must be a string' })
  productName: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  amount: number;

  @IsString({ message: 'Customer name must be a string' })
  customerName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  customerEmail: string;

  @IsString({ message: 'Customer phone must be a string' })
  customerPhone: string;

  @IsString({ message: 'Shipping address must be a string' })
  shippingAddress: string;

  @IsEnum(['aliexpress', 'alibaba'], { message: 'Source platform must be either aliexpress or alibaba' })
  sourcePlatform: string;

  @IsEnum(['naver', 'coupang', '11st'], { message: 'Target platform must be naver, coupang, or 11st' })
  targetPlatform: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
