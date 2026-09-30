# cat-nest

This is a little NestJS thing I built for learning. (no AI used)

## What is it?

- Full CRUD on `cats`
- SQLite
- Input validation with `class-validator`
- Pagination via `limit`/`offset`
- Rate limiting so nobody can abuse it
- API versioning
- Structured JSON logs

## Stack

- NestJS 12
- better-sqlite3 (raw SQL)
- class-validator
- @nestjs/throttler
- TypeScript, pnpm, Vitest, oxlint

## Running it

```bash
pnpm install
pnpm start
```

## Configuration

The port and database file path are set through environment variables.

1. Copy the example file: `cp .env.example .env`
2. Edit `.env`:

| Variable  | Default         | Description           |
| --------- | --------------- | --------------------- |
| `PORT`    | `3000`          | Port the API runs on  |
| `DB_PATH` | `./db.sqlite`   | SQLite database file  |

3. Restart the app for changes to take effect.


## Endpoints

| Method | Path           | What it does                                      |
| ------ | -------------- | ------------------------------------------------- |
| GET    | `/health`      | checks the server's alive                         |
| GET    | `/v1/cats`     | list cats — `?limit=` / `?offset=` for pagination |
| GET    | `/v1/cats/:id` | get one cat                                       |
| POST   | `/v1/cats`     | create a cat — `{ name, age }`                    |
| PATCH  | `/v1/cats/:id` | update a cat                                      |
| DELETE | `/v1/cats/:id` | delete a cat                                      |

Example:

```bash
curl -X POST localhost:3000/v1/cats -H "Content-Type: application/json" -d '{"name":"Pamuk","age":3}'
```

```json
{ "id": 1, "name": "Pamuk", "age": 3 }
```
