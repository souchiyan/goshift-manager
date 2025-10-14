FROM node:20-alpine

WORKDIR /usr/sr/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]