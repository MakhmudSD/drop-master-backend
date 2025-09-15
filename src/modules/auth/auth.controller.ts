import { UserDocument } from 'src/schemas/user.schema';
import { Controller, Get, Req, UseGuards, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, OAuthUserInputDto } from '../../libs/dto';
import { Public } from './decorators/public.decorator';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  // ---------- REGISTER ----------
  @Post('register')
  @Public()
  async register(@Body() userInput: CreateUserDto) {
    try {
      const user = await this.authService.register(userInput);
      return {
        success: true,
        data: {
          user: {
            id: user.id, // Assuming 'id' is the correct property name on the 'User' type
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            role: user.role,
            isActive: user.isActive,
          },
          token: user.accessToken,
        },
      };
    } catch (error: any) {
      // Check if it's a duplicate email error
      if (error.message && error.message.includes('already exists')) {
        return { 
          success: false, 
          message: 'An account with this email already exists. Please try logging in instead.',
          code: 'EMAIL_EXISTS'
        };
      }
      return { success: false, message: error.message || 'Registration failed' };
    }
  }

  // ---------- LOGIN ----------
  @Post('login')
  @Public()
  async login(@Body() loginInput: LoginDto) {
    try {
      const user = await this.authService.login(loginInput);
      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            role: user.role,
            isActive: user.isActive,
          },
          token: user.accessToken,
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  }

  // Test JWT verification
  @Get('test-jwt')
  @Public()
	testJwt(@Query('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { success: true, decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ---------- PROFILE ----------
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    try {
      const userId = req.user.sub || req.user.userId; // depends on JWT payload
      const user = await this.authService.getUser(userId);
	   console.log('JWT from request:', req.headers.authorization);

      return {
        success: true,
        data: {
          user: {
            id: (user as UserDocument).id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            role: user.role,
            provider: user.provider,
          },
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to get profile' };
    }
  }


  // ---------- DIRECT OAUTH LOGIN ----------
  @Post('oauth-login')
  @Public()
  async oAuthLogin(@Body() oAuthUser: OAuthUserInputDto) {
    try {
      const user = await this.authService.oAuthLogin(oAuthUser);
      return {
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            role: user.role,
            isActive: user.isActive,
            provider: user.provider,
          },
          token: user.accessToken,
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'OAuth login failed' };
    }
  }

  // ---------- UNIFIED OAUTH LOGIN ----------
  @Post('unified-oauth-login')
  @Public()
  async unifiedOAuthLogin(@Body() body: { provider: 'google' | 'kakao' | 'naver'; userData: any }) {
    try {
      const { provider, userData } = body;
      const { user } = await this.authService.unifiedOAuthLogin(provider, userData);
      return {
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            role: user.role,
            isActive: user.isActive,
            provider: user.provider,
          },
          token: user.accessToken,
        },
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'OAuth login failed' };
    }
  }

  // ---------- VERIFY TOKEN ----------
  @Post('verify-token')
  @Public()
  async verifyToken(@Body() body: { token: string }) {
    try {
      const user = await this.authService.verifyToken(body.token);
      return { valid: true, user };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  }

  
}
