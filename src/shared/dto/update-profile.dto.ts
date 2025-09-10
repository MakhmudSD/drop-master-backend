import { IsOptional, IsString, MinLength, IsObject } from 'class-validator';

export class UpdateProfileDto {
	@IsOptional()
	@IsString({ message: 'Name must be a string' })
	@MinLength(2, { message: 'Name must be at least 2 characters long' })
	name?: string;

	@IsOptional()
	@IsString({ message: 'Profile image must be a string' })
	profileImage?: string;

	@IsOptional()
	@IsObject({ message: 'Preferences must be an object' })
	preferences?: {
		language?: string;
		currency?: string;
	};
}
