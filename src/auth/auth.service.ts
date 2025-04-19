import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Verify a JWT token from Supabase
   * @param token JWT token from Supabase
   * @returns User data if token is valid
   * @throws UnauthorizedException if token is invalid
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser(token);

      if (error) {
        this.logger.error(`Token verification failed: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }

      return data.user;
    } catch (error: any) {
      this.logger.error(`Token verification exception: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Get the current user's session data
   * @param token JWT token from Supabase
   * @returns Session data if token is valid
   */
  async getSession(token: string): Promise<any> {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getSession();

      if (error) {
        this.logger.error(`Get session failed: ${error.message}`);
        throw new UnauthorizedException('Invalid session');
      }

      return data.session;
    } catch (error: any) {
      this.logger.error(`Get session exception: ${error.message}`);
      throw new UnauthorizedException('Invalid session');
    }
  }
}