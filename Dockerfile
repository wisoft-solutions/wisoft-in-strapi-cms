FROM node:18-bullseye

# Set working directory
WORKDIR /opt/

# Install system dependencies using apt (Debian-based)
RUN apt-get update && apt-get install -y \
  build-essential \
  gcc \
  autoconf \
  automake \
  zlib1g-dev \
  libpng-dev \
  nasm \
  bash \
  libvips-dev \
  git \
  && rm -rf /var/lib/apt/lists/*

# Set environment (can be overridden in docker-compose)
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Copy only package files and install deps
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install
ENV PATH=/opt/node_modules/.bin:$PATH

# Copy app source code
WORKDIR /opt/app
COPY . .

# Set file ownership to node user for better permissions
RUN chown -R node:node /opt/app

# Switch to non-root user for security
USER node

# Build the project
RUN npm run build

# Expose Strapi default port
EXPOSE 1337

# Start in development mode (or override in docker-compose)
CMD ["npm", "run", "develop"]