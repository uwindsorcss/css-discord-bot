FROM node:21-alpine

WORKDIR /app

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN corepack enable

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY ./src /app/src
COPY ./prisma /app/prisma
COPY ./tsconfig.json /app/tsconfig.json
COPY ./config.json /app/config.json
RUN pnpm prisma generate

CMD ["pnpm", "run", "start:prod"]
