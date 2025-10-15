# Base image
# Change to Node version 24 after it has LTS
ARG NODE_VERSION=22
FROM node:${NODE_VERSION} AS builder

# Create app directory
WORKDIR /usr/src/app

# A wildcard used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm run lint
RUN npm test

# Creates a "dist" folder with the production build
RUN npm run build

# Install backend dependencies
RUN npm install

# Bundle backend source
COPY . .
# Expose the port on which the app will run
EXPOSE 8080

CMD ["npm", "run", "start:prod"]
