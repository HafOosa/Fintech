# Build stage
FROM node:22.11.0-alpine AS builder

# Set working directory
WORKDIR /app

# Install specific versions of npm and Angular CLI
RUN npm install -g npm@10.9.0 && \
    npm install -g @angular/cli@19.0.0

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage 
# Note: Updated path to match Angular 19 output structure
COPY --from=builder /app/dist/fin-tech-frontend/browser/* /usr/share/nginx/html/

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]