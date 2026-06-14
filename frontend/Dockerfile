# ---- Stage 1: build the React app into static files ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build          # outputs static files into /app/dist

# ---- Stage 2: serve those files with nginx ----
# We throw away Node entirely and ship a tiny nginx image. This is a
# "multi-stage build" — the final image only contains what's needed to RUN.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
