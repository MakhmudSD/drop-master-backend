import { IsOptional, IsString, IsEnum } from 'class-validator';

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
