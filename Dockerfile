# Stage 1: Build the React frontend
FROM node:20-alpine AS build-stage
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Use --ignore-scripts to skip postinstall (which requires the client folder)
RUN npm ci --only=production --ignore-scripts
COPY . .
# Copy the built frontend from the previous stage
COPY --from=build-stage /app/client/dist ./client/dist

# Expose the application port
EXPOSE 5001

# Start the application
CMD ["node", "index.js"]
