import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  gethealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
