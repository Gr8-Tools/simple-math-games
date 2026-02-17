# Dockerfile for simple-math-games
FROM node:20-alpine as build
WORKDIR /app
COPY client ./client
COPY server ./server
WORKDIR /app/client
RUN npm install && npm run build
WORKDIR /app/server
RUN npm install

# Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/client/build ./client/build
COPY --from=build /app/server ./server
WORKDIR /app/server
EXPOSE 3000
CMD ["node", "index.js"]
