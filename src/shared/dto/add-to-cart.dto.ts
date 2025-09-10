import { IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
	@IsString()
	productId: string;

	@IsNumber()
	@IsPositive()
	@Min(1)
	quantity: number;
}
