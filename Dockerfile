FROM node:10

WORKDIR /user/src/path

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm","start"]