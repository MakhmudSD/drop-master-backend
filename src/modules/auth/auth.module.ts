import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../../libs/strategies/google.strategy';
import { KakaoStrategy } from '../../libs/strategies/kakao.strategy';
import { NaverStrategy } from '../../libs/strategies/naver.strategy';
import { JwtStrategy } from '../../libs/strategies/jwt.strategy';
import { User, UserSchema } from '../../schemas/user.schema';
import { OAuthController } from './oauth.controller';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  JwtModule.registerAsync({
  useFactory: () => ({
    secret: process.env.JWT_SECRET || 'your-secret-key',
    signOptions: { expiresIn: '7d' },
  }),
}),
    
  ],
  
  controllers: [AuthController, OAuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy, NaverStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}