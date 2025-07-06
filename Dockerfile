FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 8080
#CMD ["serve", "-s", "dist", "-l", "0.0.0.0:${PORT:-8080}"]
#CMD serve -s dist -l 0.0.0.0:${PORT:-8080}
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]



