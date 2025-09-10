/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as NaverStrategyBase } from 'passport-naver';
import { AuthService } from '../../modules/auth/auth.service';
import { ConfigService } from '@nestjs/config';

interface NaverProfileJson {
	id: string;
	email: string;
	nickname: string;
	profile_image?: string;
}

interface NaverProfile {
	_json: NaverProfileJson;
}

@Injectable()
export class NaverStrategy extends PassportStrategy(NaverStrategyBase, 'naver') {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		super({
			clientID: process.env.NAVER_CLIENT_ID || configService.get('NAVER_CLIENT_ID'),
			clientSecret: process.env.NAVER_CLIENT_SECRET || configService.get('NAVER_CLIENT_SECRET'),
			callbackURL: process.env.NAVER_CALLBACK_URL || configService.get('NAVER_CALLBACK_URL') || 'http://localhost:3001/api/auth/naver/callback',
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: NaverProfile, done: Function): Promise<void> {
		const { id, email, nickname, profile_image } = profile._json;

		const oAuthUser = {
			providerId: id,
			email,
			name: nickname,
			profileImage: profile_image,
			provider: 'naver' as const,
		};

		const user = await this.authService.oAuthLogin(oAuthUser);
		done(null, user);
	}
}
