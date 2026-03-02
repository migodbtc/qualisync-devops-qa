FROM node:20-alpine
RUN corepack enable
RUN apk add --no-cache curl
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
RUN apk add --no-cache curl \
    && curl -sL https://taskfile.dev/install.sh | sh \
    && mv bin/task /usr/local/bin/task
COPY . . 
CMD ["pnpm", "run", "dev"]