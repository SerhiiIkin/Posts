# Base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . ./

# Build the app
RUN npm run build

# Final image
FROM node:18-alpine
WORKDIR /app

# Copy package.json from the build stage
COPY --from=build /app/package.json ./
# Copy the built app
COPY --from=build /app/dist /app/dist

RUN npm install -g vite
# Install production dependencies
RUN npm install --production

# Start the app
CMD ["npm","run","preview", "--", "--host", "0.0.0.0"]

