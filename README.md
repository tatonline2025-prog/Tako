# TAKO Vietnam Website

Website demo cho Cong ty Co phan Thuong mai TAKO Viet Nam, dinh huong catalog B2B trong linh vuc cong nghe sinh hoc, y sinh phan tu va chan doan lam sang.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router

## Muc tieu giai doan nay

- Tao workspace moi va scaffold giao dien demo
- San sang cho cac trang: Trang chu, Gioi thieu, San pham / Giai phap, Tin tuc, Lien he
- Ho tro mo rong them filter, tim kiem san pham, tai PDF va form lien he luu database

## Lenh phat trien

```bash
npm run dev
```

## Lenh kiem tra

```bash
npm run lint
npm run build
```

## Ghi chu setup

- Thu muc goc ban dau la `Tako` co chu hoa, khong hop le voi ten package npm.
- Project da duoc scaffold an toan trong thu muc tam va chuyen ve root thanh cong.
- Chua khoi dong dev server trong buoc nay.

## Buoc tiep theo

- Tich hop email doanh nghiep de gui thong bao lien he tu form
- Bo sung xac thuc va phan quyen cho khu vuc quan tri
- Thay placeholder PDF va hinh minh hoa bang catalog va anh san pham thuc te

## Trang va tinh nang da hoan tat

- Trang chu, Gioi thieu, San pham / Giai phap, Tin tuc, Lien he
- Trang chi tiet san pham va tai lieu PDF placeholder theo tung san pham
- Bo loc theo linh vuc, hang san xuat, ung dung va tim kiem theo tu khoa
- API lien he luu vao MongoDB, co the gui email thong bao qua SMTP va trang demo xem danh sach lien he tai `/quan-tri/lien-he`
- Dang nhap quan tri tai `/dang-nhap` de bao ve du lieu lien he va API GET noi bo
- Sitemap XML va robots.txt co san cho SEO co ban

## Ghi chu MongoDB

- Trong moi truong hien tai, chuoi `mongodb+srv` gap loi `querySrv`, vi vay `.env.local` duoc chuyen sang dang Atlas direct connection string de persistence hoat dong on dinh.
- `.env.example` da mo ta cau truc bien moi truong can thiet de trien khai lai tren moi truong khac.

## Bien moi truong quan trong

- `MONGODB_URI`, `MONGODB_DB`, `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`, `MAIL_TO`
