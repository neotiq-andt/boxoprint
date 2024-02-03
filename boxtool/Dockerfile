FROM node:latest

# Create app directory
WORKDIR /usr/src

# Install app dependencies
COPY ./src/package*.json ./

RUN npm install

# Bundle app source
#COPY src .

EXPOSE 8080
CMD [ "npm", "start" ]
