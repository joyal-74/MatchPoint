# BUILD STAGE
FROM node:22-bookworm AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# PRODUCTION STAGE
FROM node:22-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
# Install only the 'external' dependencies needed at runtime
RUN npm install --omit=dev

COPY --from=build /app/dist/server.js ./dist/server.js

EXPOSE 3000

CMD ["node", "dist/server.js"]