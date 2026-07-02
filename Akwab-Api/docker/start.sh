#!/bin/sh
set -e

echo ">>> START.SH IS RUNNING <<<"

export PORT="${PORT:-8080}"

echo ">>> PORT IS: $PORT <<<"

envsubst '${PORT}' < /etc/nginx/http.d/default.conf.template > /etc/nginx/http.d/default.conf

echo ">>> NGINX CONFIG GENERATED <<<"

cd /var/www/api

php artisan config:clear
echo ">>> CONFIG CLEARED <<<"
php artisan route:clear
echo ">>> ROUTE CLEARED <<<"
php artisan view:clear
echo ">>> VIEW CLEARED <<<"

php artisan config:cache
echo ">>> CONFIG CACHED <<<"
php artisan route:cache
echo ">>> ROUTE CACHED <<<"
php artisan view:cache
echo ">>> VIEW CACHED <<<"

echo ">>> LAUNCHING SUPERVISORD <<<"
exec supervisord -c /etc/supervisord.conf
