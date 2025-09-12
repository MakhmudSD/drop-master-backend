import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../shared/schemas/user.schema';
import { OAuthUserInput, UserInput, LoginInput } from '../../shared/dto/user-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // ---------- Hash password ----------
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // ---------- Compare password ----------
  public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // ---------- Create JWT token ----------
public async createToken(user: UserDocument): Promise<string> {
    const payload = {
      sub: user._id?.toString(),
      email: user.email,
      role: user.role,
      provider: user.provider,
      googleId: user.googleId,
      kakaoId: user.kakaoId,
      naverId: user.naverId,
    };
    return this.jwtService.signAsync(payload);
  }

  // ---------- Verify JWT token ----------
  public async verifyToken(token: string): Promise<User> {
    return this.jwtService.verifyAsync(token);
  }

  // ---------- Unified OAuth login/signup ----------
  public async unifiedOAuthLogin(
    provider: 'google' | 'kakao' | 'naver',
    userData: any,
  ): Promise<any> {
    const oAuthUser: OAuthUserInput = this.normalizeOAuthUserData(provider, userData);
    return this.oAuthLogin(oAuthUser);
  }

  // ---------- Normalize OAuth data ----------
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
        email: data.kakao_account?.email || `${data.id}@kakao.com`, // fallback
        name: data.kakao_account?.profile?.nickname || data.properties?.nickname || 'No Name',
        profileImage: data.kakao_account?.profile?.profile_image_url || data.properties?.profile_image || '',
        provider: 'kakao',
      };
    case 'naver':
      return {
        providerId: data.id,
        email: data.email || `${data.id}@naver.com`, // optional fallback
        name: data.nickname || data.name || 'No Name',
        profileImage: data.profile_image || '',
        provider: 'naver',
      };
    default:
      throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
  }
}


  // ---------- OAuth login/signup logic ----------
public async oAuthLogin(oAuthUser: OAuthUserInput): Promise<any> {
  const { provider, providerId, email, name, profileImage } = oAuthUser;

  // Try to find user by providerId first
  let user = await this.userModel.findOne({ [`${provider}Id`]: providerId }).exec();

  // If not found by providerId, try to find by email (for existing users who might have registered with email/password)
  if (!user && email) {
    user = await this.userModel.findOne({ email }).exec();
    
    // If found by email, link the OAuth provider to existing account
    if (user) {
      user[`${provider}Id`] = providerId;
      user.provider = provider;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
    }
  }

  // If still not found, create new user
  if (!user) {
    user = await this.userModel.create({
      name,
      email,
      provider,
      [`${provider}Id`]: providerId,
      profileImage,
      role: 'user',
    });
  } else {
    // Update profile image if changed
    if (profileImage && profileImage !== user.profileImage) {
      user.profileImage = profileImage;
      await user.save();
    }
  }

  const accessToken = await this.createToken(user);
  return { ...user.toObject(), accessToken };
}


  // ---------- Update provider info ----------
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

  // ---------- Create OAuth user data ----------
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

  // ---------- Register standard user ----------
  public async register(userInput: UserInput): Promise<any> {
    const existingUser = await this.userModel.findOne({ email: userInput.email }).exec();
    if (existingUser) throw new BadRequestException('User with this email already exists');

    const hashedPassword = await this.hashPassword(userInput.password);
    const userData = { ...userInput, password: hashedPassword, isActive: true, role: 'user' };
    const user = await this.userModel.create(userData);

    const accessToken = await this.createToken(user);
    return { ...user.toObject(), accessToken };
  }

  // ---------- Login standard user ----------
  public async login(loginInput: LoginInput): Promise<any> {
    const { email, password } = loginInput;
    const user = await this.userModel.findOne({ email }).select('+password').exec();

    if (!user) throw new BadRequestException('User not found');
    if (!user.password) throw new BadRequestException('No password for this account');

    const isMatch = await this.comparePasswords(password, user.password);
    if (!isMatch) throw new BadRequestException('Invalid password');

    const accessToken = await this.createToken(user);
    return { ...user.toObject(), accessToken };
  }

  // ---------- Get user by ID ----------
  public async getUser(userId: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: userId }).exec();
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  // ---------- Get user by email ----------
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new BadRequestException('User not found');
    return user;
  }
}
