import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Database from 'better-sqlite3';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = new Database(config.get<string>('DB_PATH', './db.sqlite'));

        db.exec(
          `PRAGMA journal_mode=WAL;
          CREATE TABLE IF NOT EXISTS cats(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          age INTEGER NOT NULL
          );`,
        );

        return db;
      },
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject('DATABASE_CONNECTION') private db: Database.Database) {}

  onModuleDestroy() {
    this.db.close();
  }
}
