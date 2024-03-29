FROM node:16.14 AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm install
RUN npm rebuild
RUN npm run build

FROM node:16.14-slim AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["node", "dist/index.js"]
