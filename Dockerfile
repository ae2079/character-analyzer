# Use Bun's base image
FROM oven/bun:1

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["bun", "start"] 