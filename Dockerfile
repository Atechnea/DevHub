FROM node:20.11.1-alpine3.19
WORKDIR /usr/app
COPY . .
RUN npm install --quiet
EXPOSE 3000
CMD ["npm", "start"]
