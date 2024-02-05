FROM node:12-alpine

WORKDIR /var/www/boxtool/ui

COPY package*.json ./

RUN npm install

COPY . .

RUN { \
        echo 'PORT=8081'; \
        echo 'REACT_APP_KEYSECRET="m5QvrtDeb6YZES9t427eScEcu5CNWVfu"'; \
        echo 'REACT_APP_ISCHECKIFRAME=false'; \
        echo 'API=${BACKEND_HOST}'; \
    } > .env


# Build the React app
RUN npm run build