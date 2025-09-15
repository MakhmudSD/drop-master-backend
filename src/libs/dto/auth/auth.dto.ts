import { IsString, IsEmail, IsOptional, IsBoolean, IsDate, IsObject, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class OAuthUserInputDto {
  @IsString()
  providerId: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsString()
  provider: 'google' | 'kakao' | 'naver';
}

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

export class AuthResponseDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsObject()
  user?: UserDto;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
