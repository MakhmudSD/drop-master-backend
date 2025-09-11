import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface CustomRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    provider?: string;
    googleId?: string;
    kakaoId?: string;
    naverId?: string;
  };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const token = this.extractTokenFromHeader(request);

    this.logger.log(`Incoming request URL: ${request.url}`);
    this.logger.log(`Authorization header: ${request.headers.authorization}`);

    if (!token) {
      this.logger.warn('No token found in Authorization header');
      throw new UnauthorizedException('Access token required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<any>(token);
      this.logger.log(`JWT verified successfully: ${JSON.stringify(payload)}`);

      // Optional: check essential payload fields
      if (!payload?.sub || !payload?.email || !payload?.role) {
        this.logger.warn('Token payload missing required fields');
        throw new UnauthorizedException('Invalid token payload');
      }

      // Attach user info to request
      request.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        provider: payload.provider,
        googleId: payload.googleId,
        kakaoId: payload.kakaoId,
        naverId: payload.naverId,
      };

      return true;
    } catch (err) {
      this.logger.error('JWT verification failed', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
