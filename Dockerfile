# node with version 16.13 on debian bullseye
FROM node:20-bullseye

# add typescript node
RUN yarn global add ts-node

# make WORKDIR for app
RUN mkdir -p /app
WORKDIR /app

# # install dependencies
COPY package.json /app
COPY yarn.lock /app
RUN yarn install

# copy source code and config
COPY src /app/src
COPY tsconfig.json /app
COPY .env /app
COPY config.yaml /app

# wait-for-it setup, a script to wait for a service to be ready, in this case the database
COPY wait-for-it.sh /app
RUN chmod +x /app/wait-for-it.sh

# prisma setup
COPY prisma /app/prisma
RUN yarn prisma generate

# start by waiting for the database to be ready, then push the schema and start the app
CMD ./wait-for-it.sh db:5432 -- yarn prisma migrate dev; yarn start
