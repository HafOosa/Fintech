# Stage 1: Build Angular app
FROM node:18.20.4 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json from the frontend directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project files to the container
COPY . .

# Build the Angular application (you may also want to include the --configuration=production flag here)
RUN npm run build --prod

# Stage 2: Serve the built Angular app using Nginx
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/dist/fin-tech-frontend/browser /usr/share/nginx/html

# Copy the custom Nginx configuration into the conf.d directory
COPY ./default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the app to be served on
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
