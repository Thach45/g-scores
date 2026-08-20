FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

# Sinh ra Prisma Client
RUN npx prisma generate

# Build code TypeScript sang JavaScript để chạy nhẹ và nhanh hơn
RUN npm run build

EXPOSE 3000

# Migration và import dữ liệu phải chạy như release/one-off job riêng.
CMD ["npm", "run", "start:prod"]
