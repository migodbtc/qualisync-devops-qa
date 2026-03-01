FROM node:20-alpine
RUN corepack enable
RUN apk add --no-cache curl
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . . 
CMD ["pnpm", "run", "dev"]