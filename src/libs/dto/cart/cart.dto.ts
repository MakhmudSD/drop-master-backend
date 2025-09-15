import { IsString, IsNumber, IsOptional, IsObject, IsPositive, Min } from 'class-validator';

export class CartItemDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  productId: string;

  @IsString()
  productName: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

export class AddToCartDto {
  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsObject()
  specifications?: Record<string, any>;
}

export class UpdateCartItemDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}

export class CartDto {
  @IsString()
  userId: string;

  @IsString()
  id: string;

  @IsNumber()
  totalItems: number;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}
