FROM node:12-alpine

WORKDIR /var/www/boxtool/ui

COPY package*.json ./

RUN npm install

COPY . .

# Prepare .env 
ARG BACKEND_HOST
ENV BACKEND_HOST ${BACKEND_HOST}

RUN chmod +x init-env.sh
RUN ./init-env.sh

# Build the React app
RUN npm run build