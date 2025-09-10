import { IsOptional, IsBoolean, IsNumber, IsArray, IsString } from 'class-validator';

export class UpdateAutomationDto {
	@IsOptional()
	@IsBoolean({ message: 'Auto sourcing must be a boolean' })
	autoSourcing?: boolean;

	@IsOptional()
	@IsBoolean({ message: 'Auto upload must be a boolean' })
	autoUpload?: boolean;

	@IsOptional()
	@IsNumber({}, { message: 'Margin rate must be a number' })
	marginRate?: number;

	@IsOptional()
	@IsArray({ message: 'Target platforms must be an array' })
	@IsString({ each: true, message: 'Each target platform must be a string' })
	targetPlatforms?: string[];

	@IsOptional()
	@IsArray({ message: 'Source platforms must be an array' })
	@IsString({ each: true, message: 'Each source platform must be a string' })
	sourcePlatforms?: string[];

	@IsOptional()
	@IsArray({ message: 'Selected categories must be an array' })
	@IsString({ each: true, message: 'Each category must be a string' })
	selectedCategories?: string[];

	@IsOptional()
	@IsNumber({}, { message: 'Max products per day must be a number' })
	maxProductsPerDay?: number;

	@IsOptional()
	@IsNumber({}, { message: 'Min margin rate must be a number' })
	minMarginRate?: number;

	@IsOptional()
	@IsNumber({}, { message: 'Min sales count must be a number' })
	minSalesCount?: number;

	@IsOptional()
	@IsBoolean({ message: 'Is active must be a boolean' })
	isActive?: boolean;
}
