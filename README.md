# NestJS Supabase Backend

Secure NestJS middleware backend with Supabase integration, featuring authentication, monitoring, and rate limiting.

## Prerequisites

- Node.js 18 or higher
- Supabase account and project
- PostgreSQL (provided by Supabase)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=3000
NODE_ENV=development
API_RATE_LIMIT_TTL=60
API_RATE_LIMIT_LIMIT=100
```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start:dev
   ```

The server will be available at `http://localhost:3000` with hot-reload enabled.

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

## API Documentation

Swagger documentation is available at `/api/docs` when the server is running.

## Features

- 🔐 Authentication with Supabase
- 📊 Prometheus metrics
- 🛡️ Rate limiting
- 🔍 Health checks
- 📝 API documentation
- 🚦 Request monitoring
- 🔒 Security headers

## Available Endpoints

- `GET /health/live` - Liveness check
- `GET /health/ready` - Readiness check
- `GET /monitoring/metrics` - Prometheus metrics
- `GET /monitoring/stats` - Application statistics
- `GET /api/profile` - Get user profile
- `POST /api/message` - Send message
- `POST /api/user-location-updates` - Update user location

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:cov
```

## Security

- JWT authentication
- Rate limiting
- CORS enabled
- Helmet security headers
- Input validation
- Row Level Security (RLS)

## Monitoring

- Prometheus metrics at `/monitoring/metrics`
- Application stats at `/monitoring/stats`
- Request logging
- Error tracking


