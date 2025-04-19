import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import * as Joi from 'joi';

import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ApiModule } from './api/api.module';
import { SupabaseModule } from './supabase/supabase.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Configuration with validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_ANON_KEY: Joi.string().required(),
        SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
        API_RATE_LIMIT_TTL: Joi.number().default(60),
        API_RATE_LIMIT_LIMIT: Joi.number().default(100),
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      }),
    }),
    
    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<ThrottlerModuleOptions> => [{
       ttl: config.get<number>('API_RATE_LIMIT_TTL', 60),
          limit: config.get<number>('API_RATE_LIMIT_LIMIT', 100),
      }],
    }),
    
    // Application modules
    SupabaseModule,
    AuthModule,
    HealthModule,
    MonitoringModule,
    ApiModule,
    UsersModule,
  ],
})
export class AppModule {}