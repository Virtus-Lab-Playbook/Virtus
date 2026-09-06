FROM node:22-alpine AS base
ENV COREPACK_HOME=/corepack
RUN corepack enable
WORKDIR /app

FROM base AS dependencies
COPY . .
RUN pnpm install --frozen-lockfile

FROM dependencies AS build
RUN pnpm --filter @virtus/api build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist apps/api/dist
COPY --from=build /app/apps/api/sql apps/api/sql
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/api/node_modules apps/api/node_modules
COPY --from=build /app/apps/api/package.json apps/api/package.json
EXPOSE 4040
CMD ["node", "apps/api/dist/main.js"]
