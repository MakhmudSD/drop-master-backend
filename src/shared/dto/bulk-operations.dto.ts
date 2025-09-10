import { IsEnum, IsArray, IsString, IsOptional } from 'class-validator';

export class BulkOperationsDto {
	@IsEnum(['updateStatus', 'delete'], { message: 'Action must be either updateStatus or delete' })
	action: 'updateStatus' | 'delete';

	@IsArray({ message: 'Product IDs must be an array' })
	@IsString({ each: true, message: 'Each product ID must be a string' })
	productIds: string[];

	@IsOptional()
	data?: {
		status?: string;
	};
}
