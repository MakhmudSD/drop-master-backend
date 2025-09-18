import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
		});
	}

	async validate(payload: any) {
		try {
			console.log('JWT Strategy - validating payload:', payload);
			
			// For JWT validation, we can trust the payload and return the user info directly
			// since the JWT signature was already verified
			const user = {
				userId: payload.sub,
				email: payload.email,
				role: payload.role,
				provider: payload.provider,
				googleId: payload.googleId,
			};
			
			console.log('JWT Strategy - returning user:', user);
			return user;
		} catch (error) {
			console.error('JWT Strategy error:', error);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
