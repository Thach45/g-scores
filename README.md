# G-Scores - Hệ Thống Tra Cứu Điểm Thi THPT Quốc Gia 2024

Dự án này là hệ thống tra cứu và thống kê phổ điểm kỳ thi THPT Quốc Gia 2024, được xây dựng theo yêu cầu bài test cho vị trí Web Development Intern.

## Tính Năng Chính
- **Tra cứu điểm thi:** Tìm kiếm nhanh chóng điểm thi theo Số báo danh (SBD). Trả về kết quả trực quan cho các môn thi.
- **Thống kê phổ điểm:** Trực quan hoá phổ điểm các môn thi qua 4 mức độ: Giỏi (≥ 8), Khá (6-8), Trung bình (4-6), và Yếu (< 4) bằng biểu đồ Bar Chart.
- **Bảng xếp hạng Top 10 Khối A:** Hiển thị danh sách 10 thí sinh có tổng điểm 3 môn Toán, Vật lí, Hóa học cao nhất toàn quốc.

## Tech Stack
Dự án được xây dựng dựa trên kiến trúc hiện đại và clean code:
- **Frontend:** React, TypeScript, Vite, Tailwind CSS (v3), Recharts, Lucide React, Axios. (Ứng dụng Custom Hooks để tách biệt hoàn toàn Logic và UI).
- **Backend:** NestJS, TypeScript, Prisma ORM, class-validator, class-transformer.
- **Database:** PostgreSQL.
- **Infra:** Docker & Docker Compose để khởi chạy end-to-end chỉ với 1 dòng lệnh.

## Hướng Dẫn Cài Đặt (Local Development)

Yêu cầu hệ thống đã cài đặt sẵn `Docker` và `Docker Compose`.

**Bước 1:** Clone repository về máy.
**Bước 2:** Chạy lệnh sau tại thư mục gốc của dự án:
```bash
docker compose up --build
```

Lệnh này sẽ tự động:
1. Khởi tạo database PostgreSQL.
2. Cài đặt thư viện (`npm ci`).
3. Chạy DB Migration (`npm run prisma:deploy`).
4. Import dataset tự động (seed data). *Lưu ý: Nếu DB đã có data, script sẽ tự động bỏ qua để tiết kiệm thời gian.*
5. Khởi động Backend API ở cổng `3000`.
6. Khởi động Frontend ở cổng `5173`.

**Bước 3:** Truy cập ứng dụng tại: `http://localhost:5173`

## Cấu trúc thư mục nổi bật
- `fe/src/hooks/`: Chứa các Custom Hooks (`useDashboardData`, `useScoreSearch`) thể hiện tư duy Separation of Concerns trong React.
- `be/src/route/scores/`: Chứa toàn bộ logic xử lý API, DTO ép kiểu Prisma Decimal để chống lỗi Serialization.

## Đánh giá
Project đã hoàn thành 100% các yêu cầu Must-have và Nice-to-have của đề bài:
- [x] Script import CSV (có validate dữ liệu, batch size 1000)
- [x] Tra cứu SBD
- [x] Báo cáo phổ điểm
- [x] Top 10 khối A
- [x] UI/UX đẹp, Responsive
- [x] Chạy ổn định qua Docker end-to-end
