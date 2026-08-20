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

# Chạy db:import ngầm (background) bằng ký tự '&' để lách luật 60 giây của Render
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && (npm run db:import &) && npm run start:prod"]
