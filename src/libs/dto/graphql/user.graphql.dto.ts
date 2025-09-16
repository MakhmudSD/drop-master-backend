import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserGraphQLType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  role?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  phone?: string;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class OAuthUserInput {
  @Field()
  providerId: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field()
  provider: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  preferences?: string; // JSON string for simplicity
}

@ObjectType()
export class AuthResponseType {
  @Field()
  success: boolean;

  @Field(() => UserGraphQLType, { nullable: true })
  user?: UserGraphQLType;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class UpdateProfileResponseType {
  @Field()
  success: boolean;

  @Field(() => UserGraphQLType, { nullable: true })
  user?: UserGraphQLType;

  @Field({ nullable: true })
  message?: string;
}

@ObjectType()
export class LogoutResponseType {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
export class RefreshTokenResponseType {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  message?: string;
}

