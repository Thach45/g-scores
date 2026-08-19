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

# Chạy bản Production, bao gồm cả Migrate DB và Import CSV tự động
CMD ["sh", "-c", "npm run prisma:deploy && npm run db:import && npm run start:prod"]
