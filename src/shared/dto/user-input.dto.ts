import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UserInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class LoginInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class OAuthUserInput {
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



