FROM node:20-slim

# make WORKDIR for app
RUN mkdir -p /app
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
RUN corepack enable

# install dependencies
COPY package.json /app
COPY pnpm-lock.yaml /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --production

# copy source code and config
COPY src /app/src
COPY tsconfig.json /app
COPY .env /app
COPY config.yaml /app

# prisma setup
COPY prisma /app/prisma
RUN pnpm prisma generate

CMD ["pnpm", "run", "start:docker"]
