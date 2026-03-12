FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN rm -rf dist && npm run build && ls -la dist/src/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node dist/src/main.js"]
