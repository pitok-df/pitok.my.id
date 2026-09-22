FROM oven/bun:1.4 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.4
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.buntok/server.js ./server.js
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["bun", "server.js"]
