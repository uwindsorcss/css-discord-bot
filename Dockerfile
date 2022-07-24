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
RUN apt-get update && apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2


COPY . /app

CMD ["yarn", "start"]
