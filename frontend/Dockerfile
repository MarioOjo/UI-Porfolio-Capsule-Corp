# Multi-stage Dockerfile for building and serving the Vite frontend

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci --cache /tmp/.npm-cache
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
RUN npm install --production express@4.18.2

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
