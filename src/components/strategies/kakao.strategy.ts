import { Injectable, UnauthorizedException } from '@nestjs/common';
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

 async validate(accessToken: string, refreshToken: string, profile: any, done: (err: Error | null, user?: any) => void) {
  try {
    const acc       = profile._json?.kakao_account ?? {};
    const props     = profile._json?.properties ?? {};            // old location
    const accProfile= acc.profile ?? {};                          // new v2 location
   
    const email = acc.email ?? null; // don't fabricate emails; handle null upstream
    const name =
   props.nickname ??
   accProfile.nickname ??
   profile.displayName ??
   profile.username ??
   null;
   
    const profileImage =
   props.profile_image ??
   accProfile.profile_image_url ??
   accProfile.thumbnail_image_url ??
   '';
   
    // If you require real name/email, gate here:
    // if (!name) return done(new UnauthorizedException('Nickname permission required'), false);
   
    const oAuthUser = {
   providerId: String(profile.id),
   email,
   name: name ?? 'User',
   profileImage,
   provider: 'kakao' as const,
   emailVerified: !!acc.is_email_verified, // may always be true; do your own verification if needed
    };
   
    const user = await this.authService.oAuthLogin(oAuthUser);
    return done(null, user);
  } catch (err) {
    return done(err instanceof Error ? err : new Error('Unknown error'), false);
  }
   }
   
 }