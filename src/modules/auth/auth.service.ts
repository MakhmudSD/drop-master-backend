import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../shared/schemas/user.schema';
import { OAuthUserInput, UserInput, LoginInput } from '../../shared/dto/user-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Hash password
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // Compare password
  public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Create JWT token (filtered payload)
  public async createToken(user: User): Promise<string> {
    const payload = {
	email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      googleId: user.googleId,
      kakaoId: user.kakaoId,
      naverId: user.naverId,
    };
    return this.jwtService.signAsync(payload);
  }

  // Verify JWT token
  public async verifyToken(token: string): Promise<User> {
    return this.jwtService.verifyAsync(token);
  }

  // Unified OAuth login/signup
  public async unifiedOAuthLogin(
    provider: 'google' | 'kakao' | 'naver',
    userData: any,
  ): Promise<User> {
    const oAuthUser: OAuthUserInput = this.normalizeOAuthUserData(provider, userData);
    return this.oAuthLogin(oAuthUser);
  }

  // Normalize OAuth data from provider
  private normalizeOAuthUserData(provider: 'google' | 'kakao' | 'naver', data: any): OAuthUserInput {
    switch (provider) {
      case 'google':
        return {
          providerId: data.sub || data.id,
          email: data.email,
          name: data.name || `${data.given_name} ${data.family_name}`,
          profileImage: data.picture,
          provider: 'google',
        };
      case 'kakao':
        return {
          providerId: data.id,
          email: data.kakao_account?.email || '',
          name: data.properties?.nickname || data.name,
          profileImage: data.properties?.profile_image || data.profile_image,
          provider: 'kakao',
        };
      case 'naver':
        return {
          providerId: data.id,
          email: data.email,
          name: data.nickname || data.name,
          profileImage: data.profile_image,
          provider: 'naver',
        };
      default:
        throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
    }
  }

  // OAuth login/signup logic
  public async oAuthLogin(oAuthUser: OAuthUserInput): Promise<User> {
    const { provider, providerId, email, name, profileImage } = oAuthUser;

    let user = await this.userModel.findOne({ email }).exec();

    if (user) {
      // Update provider info if user exists
      this.updateUserProviderInfo(user, provider, providerId, profileImage);
      await user.save();
    } else {
      // Create new user
      const userData = this.createOAuthUserData(oAuthUser);
      user = await this.userModel.create(userData);
    }

    // Add accessToken for frontend
    (user as any).accessToken = await this.createToken(user);
    return user;
  }

  private updateUserProviderInfo(user: User, provider: string, providerId: string, profileImage?: string) {
    switch (provider) {
      case 'google':
        user.googleId = providerId;
        break;
      case 'kakao':
        user.kakaoId = providerId;
        break;
      case 'naver':
        user.naverId = providerId;
        break;
    }
    user.provider = provider;
    if (profileImage) user.profileImage = profileImage;
  }

  private createOAuthUserData(oAuthUser: OAuthUserInput): any {
    const { provider, providerId, email, name, profileImage } = oAuthUser;
    const userData: any = {
      email,
      name,
      provider,
      profileImage,
      password: '',
      isActive: true,
      role: 'user',
    };

    switch (provider) {
      case 'google':
        userData.googleId = providerId;
        break;
      case 'kakao':
        userData.kakaoId = providerId;
        break;
      case 'naver':
        userData.naverId = providerId;
        break;
    }

    return userData;
  }

  // Register standard user
  public async register(userInput: UserInput): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: userInput.email }).exec();
    if (existingUser) throw new BadRequestException('User with this email already exists');

    const hashedPassword = await this.hashPassword(userInput.password);

    const userData = {
      ...userInput,
      password: hashedPassword,
      isActive: true,
      role: 'user',
    };

    const user = await this.userModel.create(userData);
    (user as any).accessToken = await this.createToken(user);
    return user;
  }

  // Login standard user
  public async login(loginInput: LoginInput): Promise<User> {
    const { email, password } = loginInput;
    const user = await this.userModel.findOne({ email }).select('+password').exec();

    if (!user) throw new BadRequestException('User not found');
    if (!user.isActive) throw new BadRequestException('Account is deactivated');
    if (!user.password) throw new BadRequestException('No password for this account');

    const isMatch = await this.comparePasswords(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid password');

    (user as any).accessToken = await this.createToken(user);
    return user;
  }

  // Get user by ID
  public async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId, isActive: true }).exec();
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // Get user by email
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email, isActive: true }).exec();
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
}
