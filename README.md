
# 42-transcendence

This is a Pong game.

Deploy project with:
`docker-compose up --build`

## Tech stack

* React frontend (using typescript)
* Nest backend (using typescript)
* Swagger API
* PostgreSQL database with Prisma

## Default urls

### Front

`localhost:3001/`

### OpenApi (swagger)

`localhost:3333/docs`

## Env files templates

*  frontend: `/front/react/.env` (exposed to the public - no secrets here!)
```
REACT_APP_42API_REDIRECT="http://localhost:3001/42-redirect"
REACT_APP_42API_UID="REPLACE"
```

* backend: `/back/nest/.env`
```
DATABASE_URL='postgresql://postgres:postgres@db:5432/postgres?schema=public'
JWT_SECRET='REPLACE'

42API_REDIRECT='http://localhost:3001/42-redirect'
42API_UID='REPLACE'
42API_SECRET='REPLACE'

TWILIO_ACCOUNT_SID='REPLACE'
TWILIO_AUTH_TOKEN='REPLACE'
TWILIO_SERVICE_SID='REPLACE'
```

* test backend: `/back/nest/.env.test`
```
DATABASE_URL='postgresql://postgres:postgres@test-db:5433/postgres?schema=public'
JWT_SECRET='REPLACE'

42API_REDIRECT='http://localhost:3001/42-redirect'
42API_UID='REPLACE'
42API_SECRET='REPLACE'

TWILIO_ACCOUNT_SID='REPLACE'
TWILIO_AUTH_TOKEN='REPLACE'
TWILIO_SERVICE_SID='REPLACE'
```
