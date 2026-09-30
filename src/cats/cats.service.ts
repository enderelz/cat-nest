import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto.js';
import { Cat } from './entities/cat.entity.js';
import betterSqlite3 from 'better-sqlite3';
import { UpdateCatDto } from './dto/update-cat.dto.js';
import { als } from '../request-context.js';

@Injectable()
export class CatsService {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: betterSqlite3.Database,
  ) {}

  private readonly logger = new Logger(CatsService.name);

  // This creates new cat
  create(dto: CreateCatDto) {
    this.logger.log('Cat create called.', { requestId: als.getStore(), dto });

    // lets add cat to the database
    const result = this.db
      .prepare(`INSERT INTO cats (name, age) VALUES (?, ?)`)
      .run(dto.name, dto.age);

    const cat = this.db
      .prepare('SELECT id, name, age FROM cats WHERE id = ?')
      .get(result.lastInsertRowid) as Cat;

    this.logger.log('Cat created.', { requestId: als.getStore(), cat });

    return cat;
  }

  // This updates the existing cats.
  update(id: number, dto: UpdateCatDto) {
    this.logger.log('Cat update requested.', {
      requestId: als.getStore(),
      id,
      dto,
    });

    // is body empty?
    if (dto.name === undefined && dto.age === undefined) {
      this.logger.warn('Body not found.', { requestId: als.getStore() });
      throw new BadRequestException('Nothing to update');
    }

    // Try to update it.
    const updated = this.db
      .prepare(
        `
      UPDATE cats
      SET name = COALESCE(?, name),
          age = COALESCE(?, age)
      WHERE id = ?
      `,
      )
      .run(dto.name ?? null, dto.age ?? null, id);

    // no changes no cat
    if (updated.changes === 0) {
      this.logger.warn('Cat not found', { requestId: als.getStore(), id });
      throw new NotFoundException(`Cat #${id} not found.`);
    }

    this.logger.log('Cat updated', { requestId: als.getStore(), id, dto });
    return this.findOne(id);
  }

  // This returns all cats.
  findAll(limit = 20, offset = 0) {
    this.logger.log('All cats requested', {
      requestId: als.getStore(),
      limit,
      offset,
    });

    if (limit < 1) {
      this.logger.warn('Limit is smallar than 1', {
        requestId: als.getStore(),
        limit,
      });
      throw new BadRequestException('limit cannot be smaller than 1');
    }

    if (offset < 0) {
      this.logger.warn('Offset is smallar than 0', {
        requestId: als.getStore(),
        offset,
      });
      throw new BadRequestException('offset cannot be smaller than 0');
    }

    if (limit > 100) {
      this.logger.warn('Limit is bigger than 100', {
        requestId: als.getStore(),
        limit,
      });
      throw new BadRequestException(
        'limit cannot be bigger than 100. (Use offset to get rest)',
      );
    }

    this.logger.log('Returning all cats', {
      requestId: als.getStore(),
      limit,
      offset,
    });
    return this.db
      .prepare('SELECT id, name, age FROM cats ORDER BY id LIMIT ? OFFSET ?')
      .all(limit, offset) as Cat[];
  }

  findOne(id: number): Cat {
    this.logger.log('Cat requested', { requestId: als.getStore(), id });
    // get the cat
    const cat = this.db
      .prepare('SELECT id, name, age FROM cats WHERE id = ?')
      .get(id) as Cat | undefined;

    // Cat doesnt exist.
    if (!cat) {
      this.logger.warn('Cat doesnt exist', { requestId: als.getStore(), id });
      throw new NotFoundException(`Cat #${id} not found.`);
    }

    // It does exist! Return it.
    this.logger.log('Cat returned', { requestId: als.getStore(), cat });
    return cat;
  }

  // This removes a cat from database.
  remove(id: number) {
    this.logger.log('Cat removal requested', { requestId: als.getStore(), id });

    // Remove the cat from database.
    const result = this.db.prepare('DELETE FROM cats WHERE id = ?').run(id);

    // If there are no changes then there is probaby no cat.
    if (result.changes === 0) {
      this.logger.warn('No cat found to remove', {
        requestId: als.getStore(),
        id,
      });
      throw new NotFoundException(`Cat #${id} not found`);
    }

    this.logger.log('Cat removed', { requestId: als.getStore(), id });
  }
}
