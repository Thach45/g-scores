# G-Scores Dashboard 🚀

Một ứng dụng web Full-stack hiệu năng cao dùng để tra cứu, phân tích và trực quan hóa điểm thi THPT Quốc Gia 2024. Được xây dựng riêng cho bài test Thực tập sinh Web Developer của Golden Owl.

## 🎯 Thành tựu & Điểm nhấn Thiết kế Hệ thống (System Design)

Bên cạnh việc hoàn thành 100% các yêu cầu cơ bản, mình đã tập trung tối ưu hóa **Hiệu năng (Performance)**, **Code sạch (Clean Code)**, và **Khả năng mở rộng (Scalability)**. Dưới đây là những quyết định kiến trúc cốt lõi:

### 1. Quản lý Môn học Tập trung (OOP & Nguyên tắc DRY)
Thay vì hardcode các môn học rải rác ở nhiều file, mình đã thiết kế một **Nguồn dữ liệu duy nhất (Single Source of Truth)** để quản lý môn học (`constants/subjects.ts`).
- **Frontend:** Tự động lặp qua mảng cấu hình để vẽ giao diện (các ô điểm số).
- **Backend:** Tự động sinh các câu lệnh SQL `UNION ALL` và phân tích các cột file CSV dựa trên mảng cấu hình này.
- **Lợi ích:** Nếu Bộ Giáo Dục thêm môn học mới (ví dụ: môn Tin Học), hệ thống chỉ cần thêm đúng 1 dòng vào file cấu hình. Cả Giao diện, câu lệnh SQL Database và Script nạp CSV sẽ tự động thích ứng mà không cần phải sửa bất kỳ logic lõi nào.

### 2. Caching trong Bộ nhớ (Tối ưu Hiệu năng)
Database chứa **hơn 1 triệu dòng**. Việc chạy các phép tính gộp (`GROUP BY`, `COUNT`) để vẽ phổ điểm và sắp xếp Top 10 Khối A tiêu tốn rất nhiều CPU (~1.5 giây cho mỗi lượt truy cập).
- **Giải pháp:** Mình đã áp dụng `@nestjs/cache-manager` để lưu trữ kết quả trực tiếp vào thanh RAM của tiến trình Node.js (In-Memory Cache).
- **Kết quả:** Sau lần tính toán đầu tiên, các truy vấn Phổ điểm và Top 10 ở những lần sau được trả về trực tiếp từ RAM chỉ trong **~10ms** (nhanh hơn 150 lần). Server nay có thể chịu tải hàng ngàn người dùng cùng lúc mà không bị sập.

### 3. Tự động hóa hoàn toàn với Docker
Toàn bộ hệ thống được đóng gói (containerized). Chỉ với một dòng lệnh duy nhất, hệ thống sẽ khởi tạo Database, chạy Prisma Migration, thực thi Script nạp CSV (kiểm tra lỗi và nạp 1 triệu dòng vào Postgres), sau đó khởi động cả Backend API và Frontend.

---

## 🛠 Công nghệ sử dụng

- **Frontend:** React (Hooks), Vite, Tailwind CSS, Recharts (Vẽ biểu đồ).
- **Backend:** NestJS (TypeScript), Prisma ORM.
- **Database:** PostgreSQL.
- **DevOps:** Docker & Docker Compose.

---

## 🚀 Hướng dẫn chạy dự án (Local)

Bạn chỉ cần cài đặt Docker trên máy. Không cần cài Node.js hay Postgres thủ công.

1. **Clone project** về máy.
2. **Tải file dataset** `diem_thi_thpt_2024.csv` và đặt vào thư mục `dataset/diem_thi_thpt_2024.csv`.
3. **Khởi động ứng dụng:**
   ```bash
   docker compose up --build
   ```

**Hệ thống sẽ làm gì ở background?**
- Docker tải image PostgreSQL và khởi động Database.
- Backend chạy `npm ci`, thực thi `prisma:deploy` để tạo bảng, và chạy `db:import` để kiểm tra và nạp hơn 1.000.000 dòng từ CSV vào Postgres.
- Frontend tự động build và chạy server Vite.

4. **Truy cập ứng dụng:**
   - **Frontend UI:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:3000/api/v1](http://localhost:3000/api/v1)

---

## 📂 Cấu trúc thư mục

```text
g-scores/
├── be/                         # Backend (NestJS)
│   ├── scripts/
│   │   └── import-exam-scores.ts # Script tự động nạp CSV vào DB
│   ├── src/
│   │   ├── constants/          # Cấu hình môn học OOP tập trung
│   │   ├── prisma/             # Cấu hình Prisma ORM
│   │   ├── route/scores/       # API Logic (Controller, Service, DTOs)
│   │   └── app.module.ts       # Cấu hình CacheModule
│   └── prisma/
│       └── schema.prisma       # Database Schema
│
├── fe/                         # Frontend (React + Vite)
│   ├── src/
│   │   ├── constants/          # Cấu hình môn học tập trung
│   │   ├── features/           # Các component (search, statistics, top-a)
│   │   ├── hooks/              # Custom React Hooks (useDashboardData, useScoreSearch)
│   │   └── types/              # TypeScript Interfaces
│
├── dataset/                    # Nơi chứa file CSV gốc
└── docker-compose.yml          # Orchestrates DB, BE, và FE
```

---

## ✅ Bảng kiểm tra Yêu cầu (Checklist)

### Must Have (Bắt buộc)
- [x] Chuyển đổi data thô vào DB bằng code (Sử dụng Seeder & Prisma).
- [x] Tính năng tra cứu điểm theo Số Báo Danh (SBD).
- [x] Thống kê phổ 4 mức điểm theo từng môn học (Hiển thị bằng Bar Chart).
- [x] Danh sách Top 10 thí sinh Khối A (Toán, Lý, Hóa).

### Nice to Have (Điểm cộng)
- [x] Responsive Design (Hiển thị tốt trên Mobile, Tablet, Desktop).
- [x] Setup project bằng Docker (Chạy End-to-End tự động).
- [ ] Deploy ứng dụng lên mạng (Chưa thực hiện).

### Yêu cầu Kỹ thuật
- [x] Frontend sử dụng React Hooks.
- [x] Bắt buộc áp dụng OOP để quản lý môn học (Sử dụng mảng cấu hình tập trung).
- [x] Backend sử dụng NestJS & TypeScript.
- [x] Validate dữ liệu và chặt chẽ logic (NestJS class-validator & CsvRowValidationError).
- [x] Sử dụng Prisma ORM kết nối PostgreSQL.
