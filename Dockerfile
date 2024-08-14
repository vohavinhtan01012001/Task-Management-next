# Sử dụng Node.js làm image cơ sở
FROM node:18 AS build

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (hoặc yarn.lock)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Xây dựng ứng dụng Next.js
RUN npm run build

# Sử dụng một image nhẹ hơn để chạy ứng dụng
FROM node:18-slim

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép các file đã xây dựng từ bước build
COPY --from=build /app ./

# Cài đặt các phụ thuộc cần thiết để chạy ứng dụng
RUN npm install --only=production

# Cấu hình môi trường
ENV NODE_ENV=production

# Cung cấp cổng mà Next.js sẽ chạy
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
