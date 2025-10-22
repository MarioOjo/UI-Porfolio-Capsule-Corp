# Multi-stage Dockerfile for building and serving the Vite frontend

# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
RUN npm ci --cache /tmp/.npm-cache --omit=dev
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./server.js
RUN npm install --production express@4.18.2

ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
