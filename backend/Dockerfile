# Step 1: Build the backend (ensure this copies the src folder)
FROM node:18 AS backend-builder
WORKDIR /app

# Copy backend package.json and package-lock.json into the /app directory
COPY package.json package-lock.json ./  
RUN npm install

# Copy the backend code, including the db config
COPY . .  

# Step 2: Setup the final image for backend
FROM node:18
WORKDIR /app

# Copy the built backend from the builder stage
COPY --from=backend-builder /app /app

# Expose the backend port
EXPOSE 3001

# Run backend
CMD ["npm", "run", "start"]
