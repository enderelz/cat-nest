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

Runs on port 3000 by default, or whatever `PORT` you set.

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
