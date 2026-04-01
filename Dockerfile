# Stage 1: Build the React frontend
FROM node:18-alpine AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# Copy the built frontend from the previous stage
COPY --from=build-stage /app/client/dist ./client/dist

# Expose the application port
EXPOSE 5001

# Start the application
CMD ["node", "index.js"]
