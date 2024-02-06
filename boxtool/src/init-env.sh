#!/bin/sh

echo "DB_HOST=\"$BACKEND_DB_HOST\"" >> .env
echo "DB_USER=\"$BACKEND_DB_USER\"" >> .env
echo "DB_PASSWORD=\"$BACKEND_DB_PASSWORD\"" >> .env
echo "DB_NAME=\"$BACKEND_DB_NAME\"" >> .env