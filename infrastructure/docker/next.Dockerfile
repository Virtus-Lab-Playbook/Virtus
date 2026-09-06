FROM node:22-alpine AS build

ENV COREPACK_HOME=/corepack
RUN corepack enable
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile

ARG APP_NAME
ARG NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN pnpm --filter @virtus/${APP_NAME} build

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

ARG APP_NAME
ENV APP_NAME=${APP_NAME}
COPY --from=build /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=build /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=build /app/apps/web/public ./apps/${APP_NAME}/public

EXPOSE 3000
CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]
