import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface CustomRequest extends Request {
	user?: { [key: string]: any; userId: string; email: string; role: string };
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<CustomRequest>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException({
				message: 'Access token required',
				error: 'UNAUTHORIZED',
				statusCode: 401,
			});
		}

		try {
			const payload = await this.jwtService.verifyAsync<{ [key: string]: any; userId: string; email: string; role: string }>(token);
			if (payload === undefined || !payload.userId || !payload.email || !payload.role) {
				throw new UnauthorizedException({
					message: 'Invalid token payload',
					error: 'UNAUTHORIZED',
					statusCode: 401,
				});
			}
			request.user = payload;
			return true;
		} catch {
			throw new UnauthorizedException({
				message: 'Invalid or expired token',
				error: 'UNAUTHORIZED',
				statusCode: 401,
			});
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
