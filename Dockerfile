FROM node:10.16.0

WORKDIR /usr/src/app

COPY package*.json ./

COPY . /usr/src/app

RUN npm install

EXPOSE 3040

CMD [ "npm", "start" ]