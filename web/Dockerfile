FROM node:20.21-alpine
RUN corepack enable
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY . . 
CMD ["npm", "run", "dev"]