# Mỹ Phẩm 90+ — E-commerce Website

## Tổng quan dự án

Website thương mại điện tử bán mỹ phẩm mang thương hiệu **Mỹ Phẩm 90+**, hướng đến đối tượng khách hàng nữ tại Việt Nam. Giao diện tối giản, tone màu be/nâu ấm, sang trọng.

## Cấu trúc trang

### Header
- Logo "MỸ PHẨM 90+" nằm góc trái trên cùng (chữ in đậm + ký hiệu "+")
- Thanh điều hướng ngang gồm các mục:
  - TRANG CHỦ
  - SẢN PHẨM
  - CHĂM SÓC DA
  - TRANG ĐIỂM
  - THƯƠNG HIỆU
  - TIN TỨC
- Góc phải: icon Tài khoản, icon Yêu thích (tim), icon Giỏ hàng (có badge số lượng)
- Thanh tìm kiếm đặt ở trung tâm header, có icon kính lúp

### Hero Banner
- Ảnh nền chất lượng cao với người mẫu cầm sản phẩm serum
- Tone màu be/kem ấm áp
- Tiêu đề lớn: **"ĐẸP RẠNG NGỜI VỚI 'MỸ PHẨM 90+'"**
- Mô tả phụ: "Khám phá vẻ đẹp tự nhiên của bạn"
- Nút CTA: **"MUA NGAY"** (nền trắng, viền đen)
- Có dots indicator cho slider

### Khu vực sản phẩm nổi bật
Lưới sản phẩm dạng card (4 cột), mỗi card gồm:
- Ảnh sản phẩm (nền trắng/kem)
- Tên sản phẩm
- Đánh giá sao (5 sao màu vàng)
- Giá: format `450.000 đ`
- Nút **"THÊM VÀO GIỎ"** (nền đen, chữ trắng)
- Hover card: hiện nút **"Xem chi tiết"** overlay

#### Sản phẩm mẫu
| Tên | Giá |
|-----|-----|
| Serum Phục Hồi 90+ | 450.000 đ |
| Kem Dưỡng Ẩm Cấp Nước | 450.000 đ |
| Son Môi Lâu Trôi | 450.000 đ |
| Son Môi Lâu Trôi (variant) | 450.000 đ |

### Sidebar Giỏ hàng (Cart Drawer)
- Trượt từ bên phải
- Tiêu đề: "Sản phẩm vừa xem" / "Giỏ hàng"
- Hiển thị từng sản phẩm: ảnh nhỏ, tên, nút xóa (×), giá
- Nút **"THÊM VÀO GIỎ"** màu đen ở dưới cùng

### Footer
Chia 4 cột:
- **Về chúng tôi**: Về chúng tôi, Chính sách, Điều khoản, Trang điểm, Thương hiệu, Tổ lễ
- **Chính sách**: Điều kiện, Chính sách, Bảo mật
- **Liên hệ**: Địa chỉ, Mô tả, Số điện thoại: 011-885-123-4567
- **Hỗ trợ**: Hỗ trợ
- **Follow Us**: Icons Facebook, Instagram, TikTok
- Copyright: `© 2024 Mỹ phẩm 90+. All Rights Reserved`

## Thiết kế & Style

### Màu sắc
```
Primary background: #F5EFE6 (be ấm)
Accent/Text dark:  #1A1A1A (gần đen)
Button primary:    #1A1A1A (nền đen, chữ trắng)
Button outline:    #FFFFFF (nền trắng, viền đen)
Star rating:       #F5A623 (vàng)
Price:             #1A1A1A
Card background:   #FFFFFF
```

### Typography
- Font chính: sans-serif hiện đại (ví dụ: Inter, Be Vietnam Pro)
- Tiêu đề banner: bold, cỡ lớn (48–64px)
- Nav items: uppercase, letter-spacing rộng
- Giá sản phẩm: font-weight 600

### Layout
- Max-width container: 1280px
- Responsive: mobile-first
- Product grid: 4 cột desktop / 2 cột tablet / 1 cột mobile

## Stack kỹ thuật gợi ý

- **Frontend**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **State (cart)**: Zustand hoặc Context API
- **Ảnh**: next/image với optimization
- **Icon**: Lucide React
- **Animation**: Framer Motion (slide cart drawer, hover effects)

## Tính năng cần xây dựng

- [ ] Header sticky với thanh tìm kiếm
- [ ] Hero slider/banner tự động chuyển
- [ ] Lưới sản phẩm với hover effect
- [ ] Cart drawer từ bên phải
- [ ] Trang danh mục sản phẩm
- [ ] Trang chi tiết sản phẩm
- [ ] Wishlist (yêu thích)
- [ ] Responsive toàn bộ trang
- [ ] Footer đầy đủ thông tin
