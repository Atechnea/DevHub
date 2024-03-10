FROM node:20.11.1-alpine3.19
WORKDIR /usr/app
COPY package.json .
COPY . .
RUN npm install --quiet
EXPOSE 3000
CMD ["npm", "start"]
