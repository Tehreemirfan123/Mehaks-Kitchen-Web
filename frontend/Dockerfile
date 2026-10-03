# syntax=docker/dockerfile:1

# --- Stage 1: build the static site (menu.json is validated here) -------------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: serve with unprivileged nginx (non-root, port 8080) -------------
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

USER 101
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
