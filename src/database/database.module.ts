import { Module } from '@nestjs/common';
import Database from 'better-sqlite3';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: () => {
        const db = new Database('./src/database/db.sqlite').exec(
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
export class DatabaseModule {}
