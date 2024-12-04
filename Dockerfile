# Stage 1: Compile app

# Install node 
FROM node:18-alpine as build-step

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN mkdir -p /app

RUN apk add --no-cache \
    libc6-compat \
    fontconfig \
    libxrender \
    libxext

WORKDIR /app
COPY package.json /app

RUN npm install 

COPY . /app

RUN npm run production

FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build-step /app/dist/manager-pqrs-front /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf
