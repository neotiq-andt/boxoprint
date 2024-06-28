FROM node:12-alpine

# WORKDIR /var/www/boxtool/ui
WORKDIR /boxo-frontend

COPY package*.json ./

RUN npm install

COPY . .

# Prepare .env 
ARG BACKEND_HOST
ENV BACKEND_HOST ${BACKEND_HOST}

RUN chmod +x init-env.sh
RUN ./init-env.sh

EXPOSE 8081

# Build the React app
# RUN npm run build

CMD ["npm", "start"]