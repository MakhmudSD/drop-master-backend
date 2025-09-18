import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';
import {
  CreateUserInput,
  OAuthUserInput,
  UpdateUserInput,
  UserGraphQLType,
} from '../../libs/dto';

// Helper function to map User to UserGraphQLType
const mapUserToGraphQL = (user: User): UserGraphQLType => {
  return {
    id: (user as any)._id?.toString() || (user as any).id?.toString() || '',
    email: user.email,
    name: user.name,
    avatar: user.profileImage,
    phone: undefined, // Not in schema
    address: undefined, // Not in schema
    isActive: true, // Default value
    role: user.role || 'user',
    createdAt: (user as any).createdAt,
    updatedAt: (user as any).updatedAt,
  };
};

@Resolver(() => UserGraphQLType)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // Signup Mutation
  @Mutation(() => UserGraphQLType)
  public async signup(@Args('input') input: CreateUserInput): Promise<UserGraphQLType> {
    console.log('Mutation: signup');
    try {
      const result = await this.userService.signup(input);
      return mapUserToGraphQL(result);
    } catch (error) {
      throw new BadRequestException(
        typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      );
    }
  }

  // Note: Login is handled by AuthResolver to avoid conflicts

  // OAuth Login Mutation
  @Mutation(() => UserGraphQLType)
  public async oAuthLogin(@Args('input') input: OAuthUserInput): Promise<UserGraphQLType> {
    console.log('Mutation: oAuthLogin');
    try {
      const serviceInput = {
        providerId: input.providerId,
        email: input.email,
        name: input.name,
        profileImage: input.profileImage,
        provider: input.provider as 'google' | 'kakao' | 'naver',
      };
      const result = await this.userService.oAuthLogin(serviceInput);
      return mapUserToGraphQL(result);
    } catch (error) {
      throw new BadRequestException(
        typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      );
    }
  }

  // Get User by ID
  @Query(() => UserGraphQLType)
  public async getUser(@Args('userId') userId: string): Promise<UserGraphQLType> {
    console.log('Query: getUser');
    try {
      const result = await this.userService.getUser(userId);
      return mapUserToGraphQL(result);
    } catch (error) {
      throw new BadRequestException(
        typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      );
    }
  }

  // Get User by Email
  @Query(() => UserGraphQLType)
  public async getUserByEmail(@Args('email') email: string): Promise<UserGraphQLType> {
    console.log('Query: getUserByEmail');
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return mapUserToGraphQL(user);
    } catch (error) {
      throw new BadRequestException(
        typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      );
    }
  }

  // Update User
  @Mutation(() => UserGraphQLType)
  public async updateUser(
    @Args('userId') userId: string,
    @Args('input') input: UpdateUserInput,
  ): Promise<UserGraphQLType> {
    console.log('Mutation: updateUser');
    try {
      const result = await this.userService.updateUser(userId, input);
      return mapUserToGraphQL(result);
    } catch (error) {
      throw new BadRequestException(
        typeof error.message === 'string' ? error.message : 'An unexpected error occurred',
      );
    }
  }
}
