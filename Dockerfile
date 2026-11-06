# Base image: the lightest Node.js version
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the full codebase
COPY . .

# Port to expose (already 3000 in the code)
EXPOSE 3000

# Command to run when the container starts
CMD ["node", "server.js"]