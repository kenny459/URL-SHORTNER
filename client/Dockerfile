# Stage 1: Build the React application
# Use a Node.js image for building the app
FROM node:alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the built application with Nginx
# Use a lightweight Nginx image for production serving
FROM nginx:alpine
# Railway automatically assigns a PORT environment variable.
# Expose the default HTTP port 80 in the container
EXPOSE 80
# Copy the built files from the 'build' stage to Nginx's public serving directory
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx serves files by default, no specific command needed.
