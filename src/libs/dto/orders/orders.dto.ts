import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDate, IsObject, IsEmail } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export class OrderItemDto {
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
}

export class OrderDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  orderNumber: string;

  @IsArray()
  items: OrderItemDto[];

  @IsNumber()
  totalAmount: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class CreateOrderDto {
  @IsString()
  userId: string;

  @IsArray()
  items: OrderItemDto[];

  @IsOptional()
  @IsString()
  shippingAddress?: string;

  @IsOptional()
  @IsString()
  billingAddress?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  // Additional fields from shared DTO
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsEnum(['aliexpress', 'alibaba'])
  sourcePlatform?: string;

  @IsOptional()
  @IsEnum(['naver', 'coupang', '11st'])
  targetPlatform?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'], { 
    message: 'Status must be pending, processing, shipped, delivered, or cancelled' 
  })
  status?: string;

  @IsOptional()
  @IsString({ message: 'Tracking number must be a string' })
  trackingNumber?: string;

  @IsOptional()
  @IsString({ message: 'Notes must be a string' })
  notes?: string;
}
