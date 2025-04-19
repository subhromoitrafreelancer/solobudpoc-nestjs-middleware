import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../auth/auth.guard';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { MonitoringMiddleware } from '../monitoring/monitoring.middleware';

@Module({
  imports: [AuthModule, MonitoringModule],
  controllers: [ApiController],
  providers: [
    ApiService,
    // Global Auth Guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // Global Throttler Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply monitoring middleware to all routes
    consumer.apply(MonitoringMiddleware).forRoutes('*');
  }
}