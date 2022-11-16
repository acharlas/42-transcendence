#!/bin/sh
echo "Waiting for postgres to be ready"
while ! nc -z db 5432; do
  sleep 1
done
echo "Postgres ready"

# exec npm run start:dev:deploy
exec $@