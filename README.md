# G-Scores Dashboard

> Hệ thống tra cứu, thống kê và trực quan hóa điểm thi THPT Quốc gia năm 2024.

G-Scores Dashboard là bài tập phát triển ứng dụng web full-stack. Ứng dụng import dữ liệu điểm thi từ CSV vào PostgreSQL, cung cấp API tra cứu theo số báo danh (SBD), tổng hợp phổ điểm theo môn và hiển thị Top 10 thí sinh khối A trên dashboard.

Mục tiêu của dự án là xây dựng một luồng xử lý dữ liệu hoàn chỉnh, có kiểm tra dữ liệu đầu vào, hỗ trợ dữ liệu lớn và có thể khởi chạy đồng nhất bằng Docker.

**Bản triển khai:** [Frontend](https://fe-ten-ivory.vercel.app/) · [Backend API](https://g-scores-backend-1ivh.onrender.com/api/v1/scores)

## Mục lục

- [Người thực hiện](#người-thực-hiện)
- [Chức năng](#chức-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Các quyết định thiết kế](#các-quyết-định-thiết-kế)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Hướng dẫn khởi chạy](#hướng-dẫn-khởi-chạy)
- [Biến môi trường](#biến-môi-trường)
- [Nhập dữ liệu](#nhập-dữ-liệu)
- [Tài liệu API](#tài-liệu-api)
- [Kiểm tra dữ liệu và trường hợp biên](#kiểm-tra-dữ-liệu-và-trường-hợp-biên)
- [Hiệu năng](#hiệu-năng)
- [Kiểm thử](#kiểm-thử)
- [Đối chiếu yêu cầu](#đối-chiếu-yêu-cầu)
- [Triển khai](#triển-khai)

## Người thực hiện

| Thông tin | Chi tiết |
| --- | --- |
| Họ và tên | Nguyễn Hoàng Thạch |
| GitHub | [@Thach45](https://github.com/Thach45) |
| Dự án | G-Scores Dashboard |
| Dữ liệu | Điểm thi THPT Quốc gia năm 2024 |

## Chức năng

### 1. Tra cứu điểm theo số báo danh

Người dùng nhập SBD gồm 8 chữ số để xem điểm của các môn thi. Việc kiểm tra định dạng được thực hiện ở cả giao diện và máy chủ. Nếu không tìm thấy SBD, API trả về lỗi `404` và giao diện hiển thị thông báo phù hợp.

### 2. Thống kê phổ điểm

Hệ thống tổng hợp số thí sinh của từng môn vào bốn nhóm điểm:

| Nhóm | Điều kiện |
| --- | --- |
| Mức 1 | Điểm từ 8 trở lên |
| Mức 2 | Điểm từ 6 đến dưới 8 |
| Mức 3 | Điểm từ 4 đến dưới 6 |
| Mức 4 | Điểm dưới 4 |

Kết quả được trình bày dưới dạng biểu đồ cột, giúp so sánh nhanh phân bố điểm giữa các môn.

### 3. Bảng xếp hạng khối A

Danh sách Top 10 được tính từ tổng điểm Toán, Vật lí và Hóa học. Chỉ thí sinh có đủ cả ba điểm mới được đưa vào xếp hạng; kết quả được sắp xếp giảm dần theo tổng điểm.

### 4. Nhập dữ liệu CSV

Importer đọc tệp CSV theo luồng, kiểm tra từng bản ghi và lưu dữ liệu theo lô. Cách làm này không cần giữ toàn bộ tệp trong bộ nhớ và có thể chạy lại mà không tạo bản ghi trùng.

### 5. Giao diện dashboard

Giao diện React gồm ba khu vực chính: ô tra cứu, biểu đồ phổ điểm và bảng xếp hạng. Thiết kế đáp ứng tốt trên màn hình desktop và thiết bị có chiều rộng nhỏ hơn.

## Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
| --- | --- | --- |
| Frontend | React 19, TypeScript, Vite | Xây dựng ứng dụng một trang và build mã nguồn giao diện |
| Giao diện | Tailwind CSS, Lucide React | Bố cục, định dạng và biểu tượng |
| Biểu mẫu | React Hook Form, Zod | Quản lý và kiểm tra dữ liệu SBD phía người dùng |
| Trực quan hóa | Recharts | Vẽ biểu đồ cột phổ điểm |
| Gọi API | Axios | Giao tiếp với REST API |
| Backend | NestJS 11, TypeScript | Xây dựng API theo controller/service/DTO |
| Validation | class-validator, class-transformer | Validate request và chuyển đổi response |
| Database | PostgreSQL 16 | Lưu trữ dữ liệu điểm thi, aggregate và sắp xếp |
| ORM | Prisma 7 | Schema, migration, truy vấn và import dữ liệu |
| Hạ tầng | Docker, Docker Compose | Khởi động đồng bộ PostgreSQL, backend và frontend |

## Kiến trúc hệ thống

```text
┌──────────────────────────────┐
│ Tệp CSV điểm thi THPT 2024   │
└──────────────┬───────────────┘
               │ streaming, validation, batch insert
               ▼
┌──────────────────────────────┐
│ CSV Importer                  │
│ scripts/import-exam-scores.ts │
└──────────────┬───────────────┘
               │ Prisma createMany
               ▼
┌──────────────────────────────┐
│ PostgreSQL                    │
│ exam_scores                   │
└──────────────┬───────────────┘
               │ Prisma / truy vấn tổng hợp SQL
               ▼
┌──────────────────────────────┐
│ NestJS API                    │
│ /api/v1/scores                │
└──────────────┬───────────────┘
               │ HTTP JSON
               ▼
┌──────────────────────────────┐
│ React Dashboard               │
│ tra cứu · biểu đồ · top 10    │
└──────────────────────────────┘
```

### Luồng xử lý

1. Tệp CSV được đặt trong thư mục `be/dataset/`.
2. Importer đọc từng dòng, kiểm tra SBD, điểm và mã ngoại ngữ.
3. Các dòng hợp lệ được ghi vào bảng `exam_scores` theo từng lô.
4. Frontend gọi NestJS API để lấy dữ liệu theo SBD, phổ điểm và bảng xếp hạng.
5. API truy vấn PostgreSQL; hai báo cáo tổng hợp được lưu cache trong bộ nhớ của tiến trình backend.

## Các quyết định thiết kế

### Quản lý môn học tập trung theo OOP

Backend định nghĩa lớp `Subject` tại `be/src/domain/subject.ts`. Mỗi đối tượng chứa:

- Khóa trả về trong DTO, ví dụ `nguVan`.
- Tên cột trong cơ sở dữ liệu, ví dụ `ngu_van`.
- Nhãn hiển thị, ví dụ `Ngữ Văn`.
- Phương thức kiểm tra điểm hợp lệ và phân loại mức điểm.

Danh sách `EXAM_SUBJECTS` là nguồn cấu hình dùng để lặp qua các môn khi import và tạo truy vấn thống kê. Frontend cũng có danh sách cấu hình môn học tương ứng để render các ô điểm. Điều này giảm việc lặp logic và giúp việc bổ sung môn mới rõ ràng hơn.

### CSV streaming và batch insert

Tệp dữ liệu có thể lớn, do đó importer sử dụng `createReadStream` kết hợp `csv-parse` để xử lý tuần tự thay vì `readFile` toàn bộ tệp. Dữ liệu được gom theo lô mặc định 5.000 bản ghi rồi gọi `createMany`.

Lợi ích:

- Giới hạn mức sử dụng bộ nhớ khi import.
- Giảm số lần gửi truy vấn ghi đến PostgreSQL.
- Hiển thị được tiến độ số dòng đã xử lý, đã chèn và bị bỏ qua.
- Dễ thay đổi kích thước lô qua tùy chọn dòng lệnh.

### Aggregation tại PostgreSQL

Phổ điểm được tính bằng `COUNT` có điều kiện trên PostgreSQL. Top 10 khối A dùng biểu thức tổng ba cột điểm, lọc bản ghi thiếu điểm và `ORDER BY` trực tiếp trên database. Việc để database thực hiện aggregate giúp API chỉ nhận kết quả cuối cùng thay vì tải dữ liệu thô về Node.js.

### In-memory cache cho báo cáo

Endpoint phổ điểm và Top 10 dùng `CacheInterceptor` của NestJS. Các kết quả này là dữ liệu dùng chung cho toàn bộ người truy cập nên không cần tính lại sau mỗi request trong cùng vòng đời tiến trình. Cache hiện là in-memory cache; khi backend khởi động lại, cache được tạo lại từ đầu.

### Prisma và PostgreSQL

Prisma được dùng cho schema, migration, kết nối cơ sở dữ liệu và thao tác import/truy vấn bản ghi theo SBD. PostgreSQL đáp ứng tốt cho dữ liệu có cấu trúc và các phép `COUNT`, `ORDER BY`, cộng điểm. Phần truy vấn thống kê nhiều cột dùng SQL để biểu diễn phép gộp một cách trực tiếp.

### Phân tách trách nhiệm theo layer

- `ScoresController`: nhận HTTP request và trả response.
- `ScoresService`: xử lý nghiệp vụ tra cứu, thống kê và xếp hạng.
- DTO: ràng buộc dữ liệu đầu vào và định hình dữ liệu phản hồi.
- `PrismaService`: quản lý vòng đời kết nối database.
- Hooks frontend: tách việc tải dữ liệu dashboard và tra cứu SBD ra khỏi component giao diện.

## Cấu trúc thư mục

```text
g-scores/
├── be/                                 # Ứng dụng NestJS
│   ├── dataset/
│   │   └── diem_thi.csv                  # Dataset đầu vào
│   ├── prisma/
│   │   ├── migrations/                  # Lịch sử migration
│   │   └── schema.prisma                # Schema bảng exam_scores
│   ├── scripts/
│   │   └── import-exam-scores.ts        # Importer CSV theo luồng
│   ├── src/
│   │   ├── config/                      # Kiểm tra biến môi trường
│   │   ├── domain/subject.ts             # Mô hình môn học
│   │   ├── prisma/                      # Prisma module/service
│   │   ├── route/scores/                # API scores, service và DTO
│   │   └── shared/interceptors/          # Chuẩn hóa response
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── fe/                                 # Ứng dụng React
│   ├── src/
│   │   ├── constants/subjects.ts         # Cấu hình nhãn môn học
│   │   ├── features/                     # Search, statistics, leaderboard
│   │   ├── hooks/                        # useScoreSearch, useDashboardData
│   │   ├── pages/DashboardPage.tsx
│   │   ├── services/api.ts               # Axios client
│   │   └── types/                        # Kiểu dữ liệu API
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml                   # PostgreSQL + backend + frontend
└── README.md
```

## Hướng dẫn khởi chạy

### Cách 1: Chạy bằng Docker Compose

Đây là cách khuyến nghị để chạy đủ ba thành phần mà không cần cài Node.js hoặc PostgreSQL trực tiếp trên máy.

**Yêu cầu:** Docker Desktop, Docker Engine hoặc môi trường có Docker Compose.

1. Vào thư mục dự án:

   ```bash
   cd g-scores
   ```

2. Đảm bảo dataset tồn tại tại `be/dataset/diem_thi.csv`.

3. Khởi chạy:

   ```bash
   docker compose up --build
   ```

4. Sau khi các dịch vụ sẵn sàng, truy cập:

   | Dịch vụ | Địa chỉ |
   | --- | --- |
   | Giao diện | `http://localhost:5173` |
   | API | `http://localhost:3000/api/v1` |
   | PostgreSQL | `localhost:5432` |

Docker Compose tạo volume `postgres_data` để lưu dữ liệu PostgreSQL. Backend chạy migration, sau đó thực hiện lệnh import mặc định trước khi chạy NestJS development server.

Để dừng dịch vụ:

```bash
docker compose down
```

Để dừng và xóa cả dữ liệu PostgreSQL trong volume:

```bash
docker compose down -v
```

> Lưu ý: Lệnh có `-v` sẽ xóa dữ liệu database cục bộ. Lần khởi động tiếp theo sẽ cần import lại dataset.

### Cách 2: Chạy thủ công

**Yêu cầu:** Node.js 20 trở lên, npm, PostgreSQL 16 hoặc phiên bản tương thích.

#### Bước 1: Tạo cơ sở dữ liệu và cấu hình backend

Tạo database `g_scores`, sau đó tạo tệp `be/.env` từ `be/.env.example` và cập nhật chuỗi kết nối.

```bash
cd be
cp .env.example .env
```

#### Bước 2: Cài backend, tạo client và migration

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
```

#### Bước 3: Import dữ liệu và khởi động API

```bash
npm run db:import
npm run start:dev
```

Backend lắng nghe tại `http://localhost:3000` theo cấu hình mặc định.

#### Bước 4: Khởi động frontend

Mở một terminal khác:

```bash
cd fe
npm ci
npm run dev
```

Vite hiển thị URL truy cập trong terminal, mặc định là `http://localhost:5173`.

## Biến môi trường

### Backend: `be/.env`

| Biến | Bắt buộc | Mô tả | Ví dụ |
| --- | --- | --- | --- |
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL cho Prisma | `postgresql://g_scores:g_scores@localhost:5432/g_scores?schema=public` |
| `PORT` | Không | Cổng chạy NestJS, mặc định là `3000` | `3000` |
| `FRONTEND_URL` | Không | Origin được CORS cho phép; có thể phân tách nhiều origin bằng dấu phẩy | `http://localhost:5173` |

Ví dụ:

```env
DATABASE_URL="postgresql://g_scores:g_scores@localhost:5432/g_scores?schema=public"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### Frontend: `fe/.env` (không bắt buộc)

| Biến | Bắt buộc | Mô tả | Giá trị mặc định |
| --- | --- | --- | --- |
| `VITE_API_URL` | Không | Địa chỉ gốc của Scores API | `http://localhost:3000/api/v1/scores` |

Ví dụ khi frontend và backend được triển khai ở hai domain khác nhau:

```env
VITE_API_URL="https://api.example.com/api/v1/scores"
```

## Nhập dữ liệu

### Vị trí dataset

Lệnh import mặc định đọc tệp:

```text
be/dataset/diem_thi.csv
```

Tên tệp được giữ cố định là `diem_thi.csv`, vì vậy có thể thay dataset của năm khác (ví dụ 2025) mà không cần thay đổi script, Docker Compose hay package script. Điều kiện là file mới phải giữ nguyên schema CSV dưới đây.

### Schema CSV bắt buộc

Importer kiểm tra header trước khi đọc dữ liệu. Header bắt buộc phải có đầy đủ các cột sau, viết thường và đúng tên:

```text
sbd,toan,ngu_van,ngoai_ngu,vat_li,hoa_hoc,sinh_hoc,lich_su,dia_li,gdcd,ma_ngoai_ngu
```

| Cột | Kiểu dữ liệu | Bắt buộc | Ghi chú |
| --- | --- | --- | --- |
| `sbd` | Chuỗi 8 chữ số | Có | Khóa chính của thí sinh |
| `toan`, `ngu_van`, `ngoai_ngu` | Số từ 0 đến 10 | Có cột, có thể trống dữ liệu | Điểm các môn bắt buộc |
| `vat_li`, `hoa_hoc`, `sinh_hoc` | Số từ 0 đến 10 | Có cột, có thể trống dữ liệu | Điểm nhóm Khoa học tự nhiên |
| `lich_su`, `dia_li`, `gdcd` | Số từ 0 đến 10 | Có cột, có thể trống dữ liệu | Điểm nhóm Khoa học xã hội |
| `ma_ngoai_ngu` | `N1` đến `N7` | Có cột, có thể trống dữ liệu | Mã môn ngoại ngữ |

Cột điểm được phép trống và sẽ được lưu là `null`. Tuy nhiên, thiếu cột bắt buộc hoặc có header trùng sẽ làm importer dừng ngay từ đầu, tránh import nhầm schema. Các cột bổ sung trong CSV không ảnh hưởng đến quá trình import.

### Các lệnh import

Từ thư mục `be/`:

```bash
# Dùng đường dẫn và batch mặc định của dự án
npm run db:import

# Chỉ định tệp CSV khác
npm run db:import:file -- --file /duong-dan/diem_thi.csv

# Chỉ định kích thước batch, từ 1 đến 500.000
npm run db:import:file -- --file /duong-dan/diem_thi.csv --batch-size 5000
```

### Importer thực hiện những gì?

- Kiểm tra tệp và schema header trước khi xử lý dòng dữ liệu.
- Đọc CSV qua `csv-parse`, validate SBD, điểm và mã ngoại ngữ.
- Chuyển ô điểm trống thành `null`, sau đó ghi dữ liệu qua `createMany` theo từng batch.
- In tiến độ: số dòng đã xử lý, số bản ghi đã chèn và số SBD trùng bị bỏ qua.

### Có thể chạy import nhiều lần không?

Có. Cột `sbd` là khóa chính của bảng `exam_scores`. Importer dùng `skipDuplicates: true`, do đó SBD đã có sẽ được bỏ qua thay vì tạo bản ghi trùng hoặc làm cả lệnh thất bại.

## Tài liệu API

Địa chỉ gốc khi chạy cục bộ:

```text
http://localhost:3000/api/v1
```

Tất cả response thành công có cấu trúc:

```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {}
}
```

### Tra cứu điểm theo SBD

```http
GET /api/v1/scores/:sbd
```

Ví dụ:

```bash
curl http://localhost:3000/api/v1/scores/01000001
```

Response rút gọn:

```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "sbd": "01000001",
    "toan": 8.4,
    "nguVan": 7.5,
    "ngoaiNgu": 8.0,
    "vatLi": 7.75,
    "hoaHoc": 8.25,
    "sinhHoc": null,
    "lichSu": null,
    "diaLi": null,
    "gdcd": null
  }
}
```

### Lấy phổ điểm

```http
GET /api/v1/scores/statistics
```

Ví dụ:

```bash
curl http://localhost:3000/api/v1/scores/statistics
```

Mỗi phần tử trả về chứa tên môn và số thí sinh của bốn mức `level1` đến `level4`.

### Lấy Top 10 khối A

```http
GET /api/v1/scores/top-a
```

Ví dụ:

```bash
curl http://localhost:3000/api/v1/scores/top-a
```

Mỗi phần tử trả về gồm `sbd`, `toan`, `vat_li`, `hoa_hoc` và `total_score`.

## Kiểm tra dữ liệu và trường hợp biên

| Tình huống | Cách xử lý |
| --- | --- |
| SBD không đủ 8 ký tự | Frontend hiển thị lỗi biểu mẫu; backend từ chối request |
| SBD chứa ký tự không phải số | Frontend và backend từ chối request |
| SBD hợp lệ nhưng không tồn tại | Backend trả HTTP `404 Not Found` |
| Điểm môn bị trống | Lưu là `null`; giao diện hiển thị `-` |
| Điểm nhỏ hơn 0 hoặc lớn hơn 10 | Importer dừng với lỗi dòng CSV không hợp lệ |
| Mã ngoại ngữ sai định dạng | Importer dừng với lỗi dòng CSV không hợp lệ |
| SBD trùng khi import lại | Bản ghi trùng được bỏ qua |
| Điểm đúng bằng 4, 6, 8 | Thuộc lần lượt nhóm `4–<6`, `6–<8`, `>=8` |
| Thiếu một trong ba điểm khối A | Không xuất hiện trong Top 10 |
| Thí sinh đồng tổng điểm ở Top 10 | Sắp xếp ưu tiên theo SBD tăng dần để kết quả luôn nhất quán (deterministic) |

## Hiệu năng

Các tối ưu hiện có trong mã nguồn:

- **Đọc CSV theo luồng:** không nạp toàn bộ dataset vào RAM.
- **Ghi dữ liệu theo lô:** giảm số request ghi xuống PostgreSQL.
- **Tổng hợp trong database:** `COUNT` có điều kiện, phép cộng và sắp xếp thực hiện tại PostgreSQL.
- **Cache trong bộ nhớ:** endpoint phổ điểm và Top 10 dùng cache manager của NestJS.


## Kiểm thử

### Kịch bản kiểm thử thủ công

- Tra cứu một SBD có trong database và kiểm tra điểm từng môn.
- Tra cứu SBD không tồn tại, xác nhận giao diện báo không tìm thấy dữ liệu.
- Nhập SBD có 7/9 ký tự hoặc lẫn chữ cái.
- Kiểm tra một bản ghi có điểm môn `null`.
- Kiểm tra phân nhóm tại các giá trị biên `4`, `6`, `8`.
- Kiểm tra Top 10 chỉ có các thí sinh đủ ba môn Toán, Vật lí, Hóa học.
- Chạy import hai lần và xác nhận số dòng trùng được bỏ qua.
- Ngắt backend hoặc thay API URL để kiểm tra trạng thái lỗi khi tải dashboard/tra cứu.

## Đối chiếu yêu cầu

### Yêu cầu bắt buộc

- [x] Chuyển đổi dữ liệu CSV vào database bằng mã nguồn.
- [x] Tra cứu điểm theo số báo danh.
- [x] Thống kê bốn mức điểm cho từng môn.
- [x] Hiển thị thống kê bằng biểu đồ.
- [x] Hiển thị Top 10 thí sinh khối A.
- [x] Frontend sử dụng React Hooks.
- [x] Backend sử dụng NestJS và TypeScript.
- [x] Sử dụng Prisma ORM kết nối PostgreSQL.
- [x] Áp dụng mô hình đối tượng để quản lý môn học.

### Điểm cộng

- [x] Giao diện đáp ứng trên desktop và màn hình nhỏ.
- [x] Docker Compose khởi chạy đầy đủ database, backend và frontend.
- [x] Kiểm tra dữ liệu ở biểu mẫu, API và importer.
- [x] Cache báo cáo tổng hợp.
- [x] Triển khai bản chạy công khai.

## Triển khai

| Thành phần | URL |
| --- | --- |
| Frontend | [fe-ten-ivory.vercel.app](https://fe-ten-ivory.vercel.app/) |
| Backend API | [g-scores-backend-1ivh.onrender.com/api/v1/scores](https://g-scores-backend-1ivh.onrender.com/api/v1/scores) |

### Quy trình triển khai

1. Tạo PostgreSQL production và cấu hình `DATABASE_URL`.
2. Từ môi trường development, chạy Prisma migration và import `diem_thi.csv` vào database production.
3. Deploy backend NestJS lên Render, sử dụng cùng `DATABASE_URL`.
4. Deploy frontend React lên Vercel, đặt `VITE_API_URL` trỏ đến backend trên Render.
5. Cập nhật `FRONTEND_URL` trên Render bằng domain Vercel để cấu hình CORS.

Khi triển khai một môi trường mới, cần cấu hình tối thiểu:

- Backend: `DATABASE_URL`, `PORT`, `FRONTEND_URL`.
- Frontend: `VITE_API_URL` tại thời điểm build.
- Database: chạy Prisma migration trước khi import dữ liệu.
- CORS: đặt `FRONTEND_URL` đúng origin của frontend đã triển khai.
