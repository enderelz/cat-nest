import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { logger } from './logger.middleware.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['log', 'warn', 'error'],
      prefix: 'CatDatabase',
      json: true,
    }),
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.use(logger);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.enableShutdownHooks();

  const config: ConfigService = app.get(ConfigService);

  await app.listen(config.get<number>('PORT', 3000));
}
await bootstrap();
