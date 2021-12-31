# node with version 16.13 on debian bullseye
FROM node:16-bullseye

# add typescript node
RUN yarn global add ts-node

# make WORKDIR for app
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
RUN yarn install

COPY . /app

CMD ["yarn", "start"]
