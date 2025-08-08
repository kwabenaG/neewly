import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify Clerk JWT token
      const payload = await this.verifyClerkToken(token);
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async verifyClerkToken(token: string): Promise<any> {
    const clerkSecretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    const clerkIssuer = this.configService.get<string>('CLERK_JWT_ISSUER');

    if (!clerkSecretKey) {
      throw new Error('CLERK_SECRET_KEY not configured');
    }

    try {
      // For development, we'll use a simpler verification
      // In production, you should use Clerk's SDK or proper JWT verification
      const payload = verify(token, clerkSecretKey, {
        issuer: clerkIssuer,
        algorithms: ['HS256'], // Changed from RS256 to HS256 for development
      });
      
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
} 