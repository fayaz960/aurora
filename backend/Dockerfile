# Small, official Node base image. "alpine" = a minimal Linux, keeps the image tiny.
FROM node:22-alpine

# Everything runs inside this folder in the container.
WORKDIR /app

# Copy ONLY package files first. Docker caches this layer, so npm install
# is skipped on rebuilds unless your dependencies actually change.
COPY package.json ./
RUN npm install --omit=dev

# Now copy the rest of the source code.
COPY src ./src

# Document the port the app listens on.
EXPOSE 4000

# The command that starts the container.
CMD ["npm", "start"]
