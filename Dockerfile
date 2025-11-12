## Multi-stage Dockerfile for a Next.js 16 app using Bun
## Use a specific Bun version via a build-arg (default set to Bun >=1.2.0 which avoids known segfaults)
ARG BUN_VERSION=1.2.0
# Builder stage
FROM oven/bun:${BUN_VERSION} AS builder

WORKDIR /app

# Copy package manifest and bun lockfile for cached installs
COPY package.json bun.lockb ./

# Copy environment files
COPY .env* ./

# Install all dependencies (devDeps needed for build)
RUN bun install

# Copy rest of the source
COPY . .

#ENV NODE_ENV=production

# Build the Next.js app using the project's build script
RUN bun run build


# Runner stage
FROM oven/bun:${BUN_VERSION} AS runner
WORKDIR /app
#ENV NODE_ENV=production
#ENV PORT=3000

# Copy runtime artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/.env* ./

EXPOSE 3000

# Run the start script using Bun
CMD ["bun", "run", "start"]
