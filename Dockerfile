# Multi-stage build so the final image only ships production dependencies
# and the compiled output, not the whole node_modules dev tree.

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

# --- deps: install once, cached as long as lockfile is unchanged ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- builder: generate Prisma client + compile Next.js ---
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- runner: minimal production image ---
FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/generated ./generated

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
