# Đồ án CellPhoneX

Disclaimer: Đây chỉ là 1 đồ án được thực hiện với mục đích giáo dục, mọi thông tin và hình ảnh trên website đều được sưu tầm trên Internet. Chúng tôi không sở hữu hay chịu trách nhiệm bất kỳ thông tin nào trên web này. Nếu làm ảnh hưởng đến cá nhân hay tổ chức nào, khi được yêu cầu, chúng tôi sẽ xem xét và gỡ bỏ ngay lập tức.

## Công nghệ

- [NextJS](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Clerk](https://clerk.com/)

## Bắt đầu

### 1. Yêu cầu:

- [Nodejs](https://nodejs.org/en) - Phiên bản 20 trở lên (khuyến khích là 20.9.0)
- [Git](https://git-scm.com/)
- [Bun](https://bun.sh)

### 2. Cài đặt Bun

```bash
curl -fsSL https://bun.sh/install | bash
```

- Kiểm tra xem Bun đã được cài chưa

```bash
bun -v
# 1.2.5
```

### 3. Lấy đề án từ github (Không bắt buộc nếu đã có từ trước)

```bash
git clone https://github.com/CNPM-NC-Nhom-8/DeTaiCNPM_NC.git # Sẽ clone về trong folder DeTaiCNPM_NC
```

- Nhảy vào folder đề án

```bash
cd DeTaiCNPM_NC
```

### 4. Cài đặt các package cần thiết

```bash
bun install
```

### 5. Chạy server dev

```bash
bun dev # Mặc định chạy trên port 3000

# Output
   ▲ Next.js 14.0.1
   - Local:        http://localhost:3000
   - Environments: .env

# Hoặc

bun dev --port 3001 # Chạy trên port 3001, số port có thể thay đổi
# Output
   ▲ Next.js 14.0.1
   - Local:        http://localhost:3001
   - Environments: .env
```

### 6. Đẩy phần code mới lên

⚠ **Vui lòng không đẩy thẳng lên branch main** ⚠

#### 6.1 Tạo 1 branch mới (Khuyến khích)

```bash
git branch <Tên branch>
git checkout -b <Tên branch>

# Ví dụ
git branch Asakuri
git checkout -b Asakuri
```

#### 6.2 Thêm những file cần cần đẩy lên

```bash
git add . # Thêm tất cả các files

# Hoặc

git add ./prisma/schema.prisma ./src/app/page.tsx
```

#### 6.3 Viết commit

```bash
git commit -m "<Nội dung commit>"

# Ví dụ
git commit -m "Cập nhật schema database, layout cho trang chủ"
```

#### 6.3 Đẩy code lên github

```bash
git push origin <Tên branch>

# Ví dụ
git push origin Asakuri
```

## Tài liệu học thêm

- [Next.js](https://nextjs.org/docs)
- [ReactJS](https://react.dev/)
- [Learn Next.js](https://nextjs.org/learn)
