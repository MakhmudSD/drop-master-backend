import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { AuthService } from '../../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		super({
			clientID: process.env.KAKAO_CLIENT_ID || configService.get<string>('KAKAO_CLIENT_ID') || '',
			clientSecret: process.env.KAKAO_CLIENT_SECRET || configService.get<string>('KAKAO_CLIENT_SECRET') || '',
			callbackURL:
				process.env.KAKAO_CALLBACK_URL ||
				configService.get<string>('KAKAO_CALLBACK_URL') ||
				'http://localhost:3001/api/auth/kakao/callback',
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: {
			id: string;
			username: string;
			_json: {
				kakao_account?: { email?: string };
				properties?: { nickname?: string; profile_image?: string };
			};
		},
		done: (error: any, user: any) => void,
	) {
		try {
			const oAuthUser = {
				providerId: profile.id,
				// Use fallback email if user didn't share email
				email: profile._json.kakao_account?.email || `${profile.id}@kakao.com`,
				// Use nickname if exists, else fallback to username or "No Name"
				name: profile._json.properties?.nickname || profile.username || 'No Name',
				profileImage: profile._json.properties?.profile_image || '',
				provider: 'kakao' as const,
			};

			const user = await this.authService.oAuthLogin(oAuthUser);
			done(null, user);
		} catch (err) {
			done(err, false);
		}
	}
}
