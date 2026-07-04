FROM node:20-slim AS builder

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-slim

WORKDIR /app/server
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/src ./src
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/client/dist ./public

EXPOSE 3000
ENV NODE_ENV=production PORT=3000

CMD ["node", "src/index.js"]
