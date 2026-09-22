import { Module } from '@nestjs/common';
import { CatsService } from './cats.service.js';
import { CatsController } from './cats.controller.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  imports: [DatabaseModule],
})
export class CatsModule {}
