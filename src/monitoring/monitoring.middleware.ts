import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MonitoringMiddleware.name);

  constructor(private monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;
    
    // Capture the original end function
    const originalEnd = res.end;
    
    // Override the end function to capture metrics after response
    res.end = (args: any) => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      try {
        // Record HTTP metrics
        this.monitoringService.recordHttpRequestDuration(
          method,
          originalUrl,
          statusCode,
          responseTime / 1000, // Convert to seconds
        );
        
        this.monitoringService.incrementHttpRequestCounter(
          method,
          originalUrl,
          statusCode,
        );
        
        // Record errors (4xx and 5xx)
        if (statusCode >= 400) {
          const errorType = statusCode >= 500 ? 'server_error' : 'client_error';
          this.monitoringService.incrementHttpErrorCounter(
            method,
            originalUrl,
            statusCode,
            errorType,
          );
        }
        
        // Log the request (for non-health check endpoints to avoid noise)
        if (!originalUrl.includes('/health') && !originalUrl.includes('/monitoring/metrics')) {
          this.logger.log(
            `${method} ${originalUrl} ${statusCode} ${responseTime}ms`,
          );
        }
      } catch (error: any) {
        this.logger.error(`Error recording metrics: ${error.message}`);
      }
      
      // Call the original end function
      return originalEnd.apply(res, args);
    };
    
    next();
  }
}