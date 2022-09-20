FROM node:17.8.0-alpine
RUN npm i -g npm
RUN mkdir -p /src/app/
COPY ./package.json ./package-lock.json /src/app/
WORKDIR /src/app/
RUN npm install
COPY ./ /src/app

CMD ["npm", "start"]
