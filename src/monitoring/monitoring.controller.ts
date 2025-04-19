import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { Public } from '../auth/public.decorator';

@ApiTags('Monitoring')
@Controller('monitoring')
export class MonitoringController {
  private readonly logger = new Logger(MonitoringController.name);

  constructor(private monitoringService: MonitoringService) {}

  @Public()
  @Get('metrics')
  @ApiOperation({ summary: 'Get application metrics in Prometheus format' })
  @ApiResponse({ status: 200, description: 'Application metrics' })
  async getMetrics() {
    try {
      const metrics = await this.monitoringService.getMetrics();
      return metrics;
    } catch (error:any) {
      this.logger.error(`Failed to get metrics: ${error.message}`);
      throw error;
    }
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get application statistics in JSON format' })
  @ApiResponse({ status: 200, description: 'Application statistics' })
  async getStats() {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}