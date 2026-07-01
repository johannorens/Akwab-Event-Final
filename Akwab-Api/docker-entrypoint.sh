#!/bin/sh
set -e

cd /var/www/api

if [ ! -f vendor/autoload.php ]; then
    echo "Running composer install..."
    composer install --no-interaction --prefer-dist
fi


if [ -f .env ] && ! grep -q "^APP_KEY=base64" .env; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi


if [ ! -L public/storage ]; then
    php artisan storage:link
fi

php artisan migrate --force --no-interaction 2>/dev/null || true

exec "$@"
