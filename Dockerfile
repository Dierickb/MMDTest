FROM node:16.13.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

#CMD ["node", "src/index.js"]
CMD ["npm", "start"]
