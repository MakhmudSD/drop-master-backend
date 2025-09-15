import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID || configService.get<string>('GOOGLE_CLIENT_ID') || 'default-client-id',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || configService.get<string>('GOOGLE_CLIENT_SECRET') || 'default-client-secret',
			callbackURL: process.env.GOOGLE_CALLBACK_URL || configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/api/auth/google/callback',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: {
			id: string;
			emails: { value: string }[];
			name: { givenName: string; familyName: string };
			photos: { value: string }[];
		},
		done: (error: any, user?: any) => void,
	) {
		const oAuthUser = {
			providerId: profile.id,
			email: profile.emails?.[0]?.value || '',
			name: `${profile.name.givenName} ${profile.name.familyName}`,
			profileImage: profile.photos[0]?.value,
			provider: 'google' as const,
		};
		const user: any = await this.authService.oAuthLogin(oAuthUser);
		done(null, user);
	}
}
