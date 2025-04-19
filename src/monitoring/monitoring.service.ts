import { Injectable, OnModuleInit } from '@nestjs/common';
import * as promClient from 'prom-client';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private registry: promClient.Registry;
  public httpRequestDuration: promClient.Histogram;
  public httpRequestCounter: promClient.Counter;
  public httpErrorCounter: promClient.Counter;

  constructor() {
    // Create a new registry
    this.registry = new promClient.Registry();

    // Register default metrics
    promClient.collectDefaultMetrics({ register: this.registry });

    // HTTP request duration histogram
    this.httpRequestDuration = new promClient.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
    });

    // HTTP request counter
    this.httpRequestCounter = new promClient.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    // HTTP error counter
    this.httpErrorCounter = new promClient.Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'status_code', 'error_type'],
    });
  }

  onModuleInit() {
    // Register custom metrics
    this.registry.registerMetric(this.httpRequestDuration);
    this.registry.registerMetric(this.httpRequestCounter);
    this.registry.registerMetric(this.httpErrorCounter);
  }

  /**
   * Get all metrics in Prometheus format
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Record the duration of an HTTP request
   */
  recordHttpRequestDuration(method: string, route: string, statusCode: number, duration: number): void {
    this.httpRequestDuration.labels(method, route, statusCode.toString()).observe(duration);
  }

  /**
   * Increment the HTTP request counter
   */
  incrementHttpRequestCounter(method: string, route: string, statusCode: number): void {
    this.httpRequestCounter.labels(method, route, statusCode.toString()).inc();
  }

  /**
   * Increment the HTTP error counter
   */
  incrementHttpErrorCounter(method: string, route: string, statusCode: number, errorType: string): void {
    this.httpErrorCounter.labels(method, route, statusCode.toString(), errorType).inc();
  }
}