import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../shared/schemas/user.schema';
import { UserService } from './user.service';
import { UserInput, LoginInput, OAuthUserInput } from '../../shared/dto/user-input.dto';

@Resolver(() => User)
export class UserResolver {
	constructor(private readonly userService: UserService) {}

	@Mutation(() => User)
	public async signup(@Args('input') input: UserInput): Promise<User> {
		console.log('Mutation: signup');
		try {
			const result = await this.userService.signup(input);
			return result;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Mutation(() => User)
	public async login(@Args('input') input: LoginInput): Promise<User> {
		console.log('Mutation: login');
		try {
			return await this.userService.login(input);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Mutation(() => User)
	public async oAuthLogin(@Args('input') input: OAuthUserInput): Promise<User> {
		console.log('Mutation: oAuthLogin');
		try {
			return await this.userService.oAuthLogin(input);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Query(() => User)
	public async getUser(@Args('userId') userId: string): Promise<User> {
		console.log('Query: getUser');
		try {
			return await this.userService.getUser(userId);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Query(() => User)
	public async getUserByEmail(@Args('email') email: string): Promise<User> {
		console.log('Query: getUserByEmail');
		try {
			const user = await this.userService.getUserByEmail(email);
			if (!user) {
				throw new BadRequestException('User not found');
			}
			return user;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Mutation(() => User)
	public async updateUser(@Args('userId') userId: string, @Args('input') input: UserInput): Promise<User> {
		console.log('Mutation: updateUser');
		try {
			return await this.userService.updateUser(userId, input);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}
