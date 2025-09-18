import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    if (err || !user) {
      console.error('GraphQL Auth Error:', err, 'User:', user, 'Info:', info);
      throw err || new UnauthorizedException('Authentication required');
    }
    
    console.log('GraphQL Auth Success - User ID:', (user as any)?.userId);
    
    // Attach user to the GraphQL context for resolvers to access
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext();
    gqlContext.user = user;
    
    return user;
  }
}
