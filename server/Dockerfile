# server/Dockerfile
#
# Copy package files and install dependencies before copying the source
# code, so Docker reuses the dependency layer when only the source changes.

FROM node:22-alpine
# Alpine uses musl instead of glibc; bcrypt ships a musl prebuild, so no
# compiler toolchain is needed. Node 22 matches server/package.json engines.

ENV NODE_ENV=production
# error-handler.js hides internal error details only in production.

WORKDIR /app

COPY package*.json ./
COPY prisma7.config.ts ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npm ci --omit=dev
# npm ci runs the postinstall hook (prisma generate), which reads the
# schema and prisma7.config.ts — so both are copied first. prisma generate
# never connects to the database; this placeholder URL exists only for
# this RUN step and is not kept in the image. The real URL comes at runtime.

COPY src ./src
# Application code last: it changes most often.

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
# Applies pending migrations before the server starts.

ENV PORT=3000
EXPOSE 3000

USER node
# Run as the unprivileged "node" user: it can read the root-owned app
# files but not modify them.

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/index.js"]
# No secrets in the image. Supply them when the container starts:
#   docker run -p 3000:3000 -e DATABASE_URL=... \
#     -e ACCESS_TOKEN_SECRET=... -e REFRESH_TOKEN_SECRET=... inkwell-server
