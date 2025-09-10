import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { OAuthUserInput, UserInput, LoginInput } from '../../shared/dto/user-input.dto';
import { Public } from '../../shared/decorators/public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// Register endpoint
	@Post('register')
	@Public()
	async register(@Body() userInput: UserInput) {
		try {
			const user = await this.authService.register(userInput);
			return {
				success: true,
				data: {
					user: {
						_id: (user as any)._id,
						email: user.email,
						name: user.name,
						profileImage: user.profileImage,
						role: user.role,
						isActive: user.isActive,
					},
					token: (user as any).accessToken,
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || 'Registration failed',
			};
		}
	}

	// Login endpoint
	@Post('login')
	@Public()
	async login(@Body() loginInput: LoginInput) {
		try {
			const user = await this.authService.login(loginInput);
			return {
				success: true,
				data: {
					user: {
						_id: (user as any)._id,
						email: user.email,
						name: user.name,
						profileImage: user.profileImage,
						role: user.role,
						isActive: user.isActive,
					},
					token: (user as any).accessToken,
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || 'Login failed',
			};
		}
	}

	// Get user profile
	@Get('profile')
	async getProfile(@Req() req: Request) {
		try {
			if (!req.user) {
				throw new Error('User is not authenticated');
			}
			const user = await this.authService.getUser(req.user.userId);
			return {
				success: true,
				data: {
					user: {
						_id: (user as any)._id,
						email: user.email,
						name: user.name,
						profileImage: user.profileImage,
						role: user.role,
						isActive: user.isActive,
						provider: user.provider,
					},
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || 'Failed to get profile',
			};
		}
	}

	// Google OAuth routes
	@Get('google')
	@Public()
	@UseGuards(AuthGuard('google'))
	async googleAuth(@Req() req: Request) {
		// This will redirect to Google OAuth
	}

	@Get('google/callback')
	@Public()
	@UseGuards(AuthGuard('google'))
	googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const user = req.user as any;
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

		// Redirect to frontend with user data and token
		const userData = {
			id: user._id,
			email: user.email,
			name: user.name,
			profileImage: user.profileImage,
			provider: 'google'
		};
		const token = user.accessToken;
		res.redirect(`${frontendUrl}/auth/callback?provider=google&user=${encodeURIComponent(JSON.stringify(userData))}&token=${token}`);
	}

	// Kakao OAuth routes
	@Get('kakao')
	@Public()
	@UseGuards(AuthGuard('kakao'))
	async kakaoAuth(@Req() req: Request) {
		// This will redirect to Kakao OAuth
	}

	@Get('kakao/callback')
	@Public()
	@UseGuards(AuthGuard('kakao'))
	kakaoAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const user = req.user as any;
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

		// Redirect to frontend with user data and token
		const userData = {
			id: user._id,
			email: user.email,
			name: user.name,
			profileImage: user.profileImage,
			provider: 'kakao'
		};
		const token = user.accessToken;
		res.redirect(`${frontendUrl}/auth/callback?provider=kakao&user=${encodeURIComponent(JSON.stringify(userData))}&token=${token}`);
	}

	// Naver OAuth routes
	@Get('naver')
	@Public()
	@UseGuards(AuthGuard('naver'))
	async naverAuth(@Req() req: Request) {
		// This will redirect to Naver OAuth
	}

	@Get('naver/callback')
	@Public()
	@UseGuards(AuthGuard('naver'))
	naverAuthRedirect(@Req() req: Request, @Res() res: Response) {
		const user = req.user as any;
		const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

		// Redirect to frontend with user data and token
		const userData = {
			id: user._id,
			email: user.email,
			name: user.name,
			profileImage: user.profileImage,
			provider: 'naver'
		};
		const token = user.accessToken;
		res.redirect(`${frontendUrl}/auth/callback?provider=naver&user=${encodeURIComponent(JSON.stringify(userData))}&token=${token}`);
	}

	// Direct OAuth login endpoint for frontend
	@Post('oauth-login')
	@Public()
	async oAuthLogin(@Body() oAuthUser: OAuthUserInput) {
		try {
			const user = await this.authService.oAuthLogin(oAuthUser);
			return {
				success: true,
				data: {
					user: {
						_id: (user as any)._id,
						email: user.email,
						name: user.name,
						profileImage: user.profileImage,
						role: user.role,
						isActive: user.isActive,
						provider: user.provider,
					},
					token: (user as any).accessToken,
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || 'OAuth login failed',
			};
		}
	}

	// Unified OAuth login endpoint
	@Post('unified-oauth-login')
	@Public()
	async unifiedOAuthLogin(@Body() body: { provider: 'google' | 'kakao' | 'naver'; userData: any }) {
		try {
			const { provider, userData } = body;
			const user = await this.authService.unifiedOAuthLogin(provider, userData);
			return {
				success: true,
				data: {
					user: {
						_id: (user as any)._id,
						email: user.email,
						name: user.name,
						profileImage: user.profileImage,
						role: user.role,
						isActive: user.isActive,
						provider: user.provider,
					},
					token: (user as any).accessToken,
				},
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || 'OAuth login failed',
			};
		}
	}

	// Verify token endpoint
	@Post('verify-token')
	@Public()
	async verifyToken(@Body() body: { token: string }) {
		try {
			const user = await this.authService.verifyToken(body.token);
			return { valid: true, user };
		} catch (error) {
			return { valid: false, error: error.message };
		}
	}
}
