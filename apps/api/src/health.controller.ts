import { Controller, Get } from '@nestjs/common';

type HealthResponse = {
  status: 'ok' | 'not_ready';
  service: string;
  timestamp: string;
};

@Controller()
export class HealthController {
  @Get('health')
  health(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  ready(): HealthResponse {
    const configured = Boolean(process.env.DATABASE_URL && process.env.REDIS_URL);

    return {
      status: configured ? 'ok' : 'not_ready',
      service: 'api',
      timestamp: new Date().toISOString(),
    };
  }
}
