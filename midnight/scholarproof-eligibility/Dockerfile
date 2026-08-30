FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ENV PORT=4000
EXPOSE 4000

CMD ["pnpm", "exec", "tsx", "src/server.ts"]
