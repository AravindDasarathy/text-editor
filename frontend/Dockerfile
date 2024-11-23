# frontend/Dockerfile

FROM node:18-slim

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "build", "-l", "3000"]
