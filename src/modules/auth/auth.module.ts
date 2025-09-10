import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from '../../shared/strategies/google.strategy';
import { KakaoStrategy } from '../../shared/strategies/kakao.strategy';
import { NaverStrategy } from '../../shared/strategies/naver.strategy';
import { JwtStrategy } from '../../shared/strategies/jwt.strategy';
import { User, UserSchema } from '../../shared/schemas/user.schema';

@Module({
  imports: [
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy, NaverStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}