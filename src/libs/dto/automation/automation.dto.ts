import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsObject } from 'class-validator';

export class AutomationSettingsDto {
  @IsBoolean()
  autoSourcing: boolean;

  @IsBoolean()
  autoUpload: boolean;

  @IsNumber()
  marginRate: number;

  @IsArray()
  targetPlatforms: string[];

  @IsArray()
  sourcePlatforms: string[];

  @IsArray()
  selectedCategories: string[];

  @IsNumber()
  maxProductsPerDay: number;

  @IsNumber()
  minMarginRate: number;

  @IsNumber()
  minSalesCount: number;

  @IsBoolean()
  isActive: boolean;
}

export class AutomationDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsObject()
  settings: AutomationSettingsDto;

  @IsOptional()
  @IsString()
  lastRunAt?: string;

  @IsOptional()
  @IsString()
  nextRunAt?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}

export class UpdateAutomationDto {
  @IsOptional()
  @IsObject()
  settings?: AutomationSettingsDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Individual field updates
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
}
