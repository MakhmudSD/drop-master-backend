import { Controller, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as axios from 'axios';
import { Response } from 'express';
@Controller('auth')
export class OAuthController {
	constructor(private readonly authService: AuthService) {}

	// ---------- GOOGLE ----------
	@Get('google')
	googleLogin(@Res() res: Response) {
		const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&scope=openid%20profile%20email`;
		return res.redirect(redirectUrl);
	}

	@Get('google/callback')
	async googleCallback(@Query('code') code: string, @Res() res: Response) {
		interface GoogleTokenResponse {
			access_token: string;
			expires_in: number;
			scope: string;
			token_type: string;
			id_token?: string;
		}

		const tokenRes = await axios.post<GoogleTokenResponse>('https://oauth2.googleapis.com/token', {
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: process.env.GOOGLE_CALLBACK_URL,
			grant_type: 'authorization_code',
		});

		const googleAccessToken = tokenRes.data.access_token;

		const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { Authorization: `Bearer ${googleAccessToken}` },
		});

		const user = await this.authService.unifiedOAuthLogin('google', profileRes.data);
		return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${user.accessToken}`);
	}

	// ---------- KAKAO ----------
	@Get('kakao')
	kakaoLogin(@Res() res: Response) {
		const redirectUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_CALLBACK_URL}`;
		return res.redirect(redirectUrl);
	}

	@Get('kakao/callback')
	async kakaoCallback(@Query('code') code: string, @Res() res: Response) {
		try {
			interface KakaoTokenResponse {
				access_token: string;
				token_type: string;
				refresh_token?: string;
				expires_in: number;
				scope?: string;
			}

			const tokenRes = await axios.post<KakaoTokenResponse>(
				'https://kauth.kakao.com/oauth/token',
				new URLSearchParams({
					client_id: process.env.KAKAO_CLIENT_ID!,
					client_secret: process.env.KAKAO_CLIENT_SECRET || '',
					redirect_uri: process.env.KAKAO_CALLBACK_URL!,
					grant_type: 'authorization_code',
					code,
				}),
				{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
			);

			const kakaoAccessToken = tokenRes.data.access_token;

			const profileRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
				headers: { Authorization: `Bearer ${kakaoAccessToken}` },
			});

			const kakaoProfile = profileRes.data as {
				id: string;
				kakao_account?: {
					email?: string;
					profile?: {
						nickname?: string;
						profile_image_url?: string;
					};
				};
			};
			const kakaoAccount = kakaoProfile.kakao_account ?? {};
			const kakaoProfileInfo = kakaoAccount.profile ?? {};

			// Map to unified user object
			const userData = {
				providerId: kakaoProfile.id,
				email: kakaoAccount.email || null,
				name: kakaoProfileInfo.nickname || 'User',
				profileImage: kakaoProfileInfo.profile_image_url || '',
				provider: 'kakao' as const,
			};

			const user = await this.authService.unifiedOAuthLogin('kakao', userData);
			return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${user.accessToken}`);
		} catch (err) {
			console.error('Kakao OAuth error:', err.response?.data || err.message);
			return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_error`);
		}
	}

	// ---------- NAVER ----------
	@Get('naver')
	naverLogin(@Res() res: Response) {
		const redirectUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_CALLBACK_URL}&state=random_state`;
		return res.redirect(redirectUrl);
	}

	@Get('naver/callback')
	async naverCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
		interface NaverTokenResponse {
			access_token: string;
			token_type: string;
			refresh_token?: string;
			expires_in: string;
			error?: string;
			error_description?: string;
		}

		const tokenRes = await axios.post<NaverTokenResponse>('https://nid.naver.com/oauth2.0/token', null, {
			params: {
				grant_type: 'authorization_code',
				client_id: process.env.NAVER_CLIENT_ID,
				client_secret: process.env.NAVER_CLIENT_SECRET,
				redirect_uri: process.env.NAVER_CALLBACK_URL,
				code,
				state,
			},
		});

		const naverAccessToken = tokenRes.data.access_token;

		interface NaverProfileResponse {
			response: {
				id: string;
				nickname?: string;
				email?: string;
				name?: string;
				profile_image?: string;
			};
		}

		const profileRes = await axios.get<NaverProfileResponse>('https://openapi.naver.com/v1/nid/me', {
			headers: { Authorization: `Bearer ${naverAccessToken}` },
		});

		const user = await this.authService.unifiedOAuthLogin('naver', profileRes.data.response);
		return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${user.accessToken}`);
	}
}
