# Build the React app, then run the API and serve the static bundle from one process.
FROM node:20-alpine AS web
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend ./backend
COPY --from=web /app/frontend/dist ./frontend/dist
EXPOSE 3000
CMD ["node", "backend/src/server.js"]
