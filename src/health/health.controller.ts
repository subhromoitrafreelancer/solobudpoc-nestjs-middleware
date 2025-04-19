import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupabaseService } from '../supabase/supabase.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private supabaseService: SupabaseService) {}

  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Check if the application is live' })
  @ApiResponse({ status: 200, description: 'Application is live' })
  async liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api',
    };
  }

  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Check if the application is ready to serve requests' })
  @ApiResponse({ status: 200, description: 'Application is ready' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async readiness() {
    try {
      // Check Supabase connection
      const { data, error } = await this.supabaseService
        .getClient()
        .from('_test_connection_')
        .select('*')
        .limit(1)
        .maybeSingle();

      // Connection error handling - don't fail on table not existing
      if (error && !error.message.includes('does not exist')) {
        this.logger.error(`Supabase connection error: ${error.message}`);
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
          service: 'api',
          dependencies: {
            supabase: {
              status: 'error',
              message: 'Failed to connect to Supabase',
            },
          },
        };
      }

      // All checks passed
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'api',
        dependencies: {
          supabase: {
            status: 'ok',
          },
        },
      };
    } catch (error: any) {
      this.logger.error(`Health check error: ${(error as Error).message}`);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'api',
        error: (error as Error).message,
      };
    }
  }
}