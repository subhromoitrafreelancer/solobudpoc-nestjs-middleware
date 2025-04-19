import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    
    return next.handle().pipe(
      tap({
        next: (val) => {
          const response = context.switchToHttp().getResponse();
          const statusCode = response.statusCode;
          const responseTime = Date.now() - now;
          
          this.logger.log(
            `${method} ${url} ${statusCode} ${responseTime}ms`,
          );
        },
        error: (err) => {
          const statusCode = err.status || 500;
          const responseTime = Date.now() - now;
          
          this.logger.error(
            `${method} ${url} ${statusCode} ${responseTime}ms`,
          );
        }
      }),
    );
  }
}