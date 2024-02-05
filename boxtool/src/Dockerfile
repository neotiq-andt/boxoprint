FROM node:14-alpine

WORKDIR /var/www/boxtool/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN { \
        echo 'DB_HOST="${BACKEND_DB_HOST}"'; \
        echo 'DB_USER="${BACKEND_DB_USER}"'; \
        echo 'DB_PASSWORD="${BACKEND_DB_PASSWORD}"'; \
        echo 'DB_NAME="${BACKEND_DB_NAME}"'; \
    } > .env



EXPOSE 8082

CMD ["npm", "start"]