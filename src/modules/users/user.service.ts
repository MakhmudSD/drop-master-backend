import { Injectable, BadRequestException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../shared/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { UserInput, LoginInput, OAuthUserInput } from '../../shared/dto/user-input.dto';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>,
		@Inject(forwardRef(() => AuthService))
		private authService: AuthService,
	) {}

	// Signup
	public async signup(input: UserInput): Promise<User> {
		try {
			// Check if user already exists
			const existingUser = await this.userModel.findOne({ email: input.email }).exec();
			if (existingUser) {
				throw new BadRequestException('User with this email already exists');
			}

			// Hash password
			const hashedPassword = await this.authService.hashPassword(input.password);

			// Create user
			const userData = {
				...input,
				password: hashedPassword,
				isActive: true,
				role: 'user',
			};

			const result = await this.userModel.create(userData);
			(result as any).accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			console.log('ERROR on service Model of signup', err.message);
			throw new BadRequestException(err.message || 'Signup failed');
		}
	}

	// Login
	public async login(input: LoginInput): Promise<User> {
		const { email, password } = input;
		const response = await this.userModel.findOne({ email }).select('+password').exec();

		if (!response) {
			throw new InternalServerErrorException('User not found');
		}

		if (!response.isActive) {
			throw new InternalServerErrorException('Account is deactivated');
		}

		if (!response.password) {
			throw new InternalServerErrorException('No password found for this account');
		}

		const isMatch = await this.authService.comparePasswords(password, response.password);
		if (!isMatch) {
			throw new InternalServerErrorException('Invalid password');
		}

		(response as any).accessToken = await this.authService.createToken(response);
		return response;
	}

	// OAuth Login
	public async oAuthLogin(input: OAuthUserInput): Promise<User> {
		return await this.authService.oAuthLogin(input);
	}

	// Update User
	public async updateUser(userId: string, input: Partial<UserInput>): Promise<User> {
		try {
			const result = await this.userModel
				.findOneAndUpdate({ _id: userId, isActive: true }, input, { new: true })
				.exec();

			if (!result) {
				throw new InternalServerErrorException('User not found or update failed');
			}

			(result as any).accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			console.log('ERROR updating user', err.message);
			throw new InternalServerErrorException('Update failed');
		}
	}

	// Get User
	public async getUser(userId: string): Promise<User> {
		const user = await this.userModel.findOne({ _id: userId, isActive: true }).exec();
		if (!user) {
			throw new InternalServerErrorException('User not found');
		}
		return user;
	}

	// Get User by Email
	public async getUserByEmail(email: string): Promise<User | null> {
		return await this.userModel.findOne({ email, isActive: true }).exec();
	}
}
