# Step 1: Build the frontend
FROM node:18 AS builder
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source files
COPY . .

# Build the frontend for production
RUN npm run build

# Step 2: Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the port for the frontend
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
