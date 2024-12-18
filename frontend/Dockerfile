# Stage 1: Build the Angular application
FROM node:22.10.0 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular application in production mode
RUN ng build --configuration=production

# Stage 2: Serve the application using Nginx
FROM nginx:latest

# Copy the built application from the build stage to the Nginx HTML directory
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 4200 to allow access to the application
EXPOSE 4200