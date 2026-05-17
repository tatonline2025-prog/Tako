# TAKO Vietnam Website

Website demo cho Công ty Cổ phần Thương mại TAKO Việt Nam, định hướng catalog B2B trong lĩnh vực công nghệ sinh học, y sinh phân tử và chẩn đoán lâm sàng.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router

## Mục tiêu giai đoạn này

- Tạo workspace mới và scaffold giao diện demo
- Sẵn sàng cho các trang: Trang chủ, Giới thiệu, Sản phẩm / Giải pháp, Tin tức, Liên hệ
- Hỗ trợ mở rộng thêm filter, tìm kiếm sản phẩm, tải PDF và form liên hệ lưu database

## Lệnh phát triển

```bash
npm run dev
```

## Lệnh kiểm tra

```bash
npm run lint
npm run build
npm run vercel:env:sync -- --project tako --team tats-projects-115f5c12
```

## Ghi chú setup

- Thư mục gốc ban đầu là `Tako` có chữ hoa, không hợp lệ với tên package npm.
- Project đã được scaffold an toàn trong thư mục tạm và chuyển về root thành công.
- Chưa khởi động dev server trong bước này.

## Bước tiếp theo

- Tích hợp email doanh nghiệp để gửi thông báo liên hệ từ form
- Bổ sung xác thực và phân quyền cho khu vực quản trị
- Thay placeholder PDF và hình minh họa bằng catalog và ảnh sản phẩm thực tế

## Trang và tính năng đã hoàn tất

- Trang chủ, Giới thiệu, Sản phẩm / Giải pháp, Tin tức, Liên hệ
- Trang chi tiết sản phẩm và tài liệu PDF placeholder theo từng sản phẩm
- Bộ lọc theo lĩnh vực, hãng sản xuất, ứng dụng và tìm kiếm theo từ khóa
- API liên hệ lưu vào MongoDB, có thể gửi email thông báo qua SMTP hoặc Resend và trang demo xem danh sách liên hệ tại `/quan-tri/lien-he`
- Đăng nhập quản trị tại `/dang-nhap` để bảo vệ dữ liệu liên hệ và API GET nội bộ
- Trang `/quan-tri/cai-dat` để xem trạng thái cấu hình MongoDB, admin auth, SMTP, Resend và hướng dẫn Gmail SMTP
- Chuyển đổi ngôn ngữ Việt/Anh bằng cờ trên thanh điều hướng
- Sitemap XML và robots.txt có sẵn cho SEO cơ bản

## Ghi chú MongoDB

- Trong môi trường hiện tại, chuỗi `mongodb+srv` gặp lỗi `querySrv`, vì vậy `.env.local` được chuyển sang dạng Atlas direct connection string để persistence hoạt động ổn định.
- `.env.example` đã mô tả cấu trúc biến môi trường cần thiết để triển khai lại trên môi trường khác.

## Biến môi trường quan trọng

- `MONGODB_URI`, `MONGODB_DB`, `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
- `RESEND_API_KEY`

## Đồng bộ biến môi trường lên Vercel

- Chạy `npm run vercel:env:sync -- --project tako --team tats-projects-115f5c12` để tự động upsert các biến môi trường từ `.env.local` lên `development`, `preview`, `production`.
- Script mặc định bỏ qua `NEXT_PUBLIC_SITE_URL` nếu giá trị đang trỏ về `localhost` để tránh đẩy URL local lên production.
- Nếu bạn thực sự muốn sync URL local, thêm cờ `--allow-localhost-site-url`.
