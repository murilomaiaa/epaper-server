
# Use the official Node.js image as the base image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN npm run build

# Run migrations
RUN npx drizzle-kit generate && npx drizzle-kit migrate

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]