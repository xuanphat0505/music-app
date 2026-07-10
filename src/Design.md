---
name: Caziq Neo-Vibrant
colors:
  surface: '#18181c'
  surface-dim: '#18181c'
  surface-bright: '#26262b'
  surface-container-lowest: '#0c0c0e'
  surface-container-low: '#121215'
  surface-container: '#18181c'
  surface-container-high: '#202025'
  surface-container-highest: '#292930'
  on-surface: '#ffffff'
  on-surface-variant: '#8a8a93'
  inverse-surface: '#ffffff'
  inverse-on-surface: '#18181c'
  outline: '#8a8a93'
  outline-variant: '#3e3e44'
  surface-tint: '#ff5a14'
  primary: '#ff5a14'
  on-primary: '#ffffff'
  primary-container: '#cc4810'
  on-primary-container: '#ffebe3'
  inverse-primary: '#cc4810'
  secondary: '#00e5c9'
  on-secondary: '#0c0c0e'
  secondary-container: '#00b39d'
  on-secondary-container: '#d9fcf8'
  tertiary: '#4d44b5'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e3691'
  on-tertiary-container: '#e5e3f7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffebe3'
  primary-fixed-dim: '#ff8f59'
  on-primary-fixed: '#4d1400'
  on-primary-fixed-variant: '#993306'
  secondary-fixed: '#d9fcf8'
  secondary-fixed-dim: '#66edd9'
  on-secondary-fixed: '#003730'
  on-secondary-fixed-variant: '#006d5f'
  tertiary-fixed: '#e5e3f7'
  tertiary-fixed-dim: '#9089d7'
  on-tertiary-fixed: '#0d074d'
  on-tertiary-fixed-variant: '#2b2182'
  background: '#0c0c0e'
  on-background: '#ffffff'
  surface-variant: '#202025'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-padding: 20px
  stack-gap: 16px
  item-gap: 12px
  bottom-bar-clearance: 90px
---

# Caziq Neo-Vibrant Design System

Hệ thống thiết kế **Caziq Neo-Vibrant** mang phong cách giao diện tối siêu thực (Cyber Obsidian) kết hợp với các hình khối hình học trừu tượng có độ tương phản và năng lượng cực cao. Nhắm tới trải nghiệm âm nhạc sống động, trẻ trung và độc bản.

---

## 1. Bảng Màu Chính (Core Palette)

*   **Nền tối chủ đạo (`BACKGROUND` - `#0c0c0e`):** Nền đen xám sẫm màu đặc, không sử dụng hiệu ứng bóng mờ (glassmorphism) quá đà để nổi bật các hình khối nghệ thuật.
*   **Màu nhấn chính (`PRIMARY` - `#ff5a14`):** Cam san hô nổi bật, dùng cho nút phát nhạc lớn, biểu tượng đang chạy, trạng thái được chọn trên Tab Bar, các card đặc biệt.
*   **Màu nhấn phụ (`SECONDARY` - `#00e5c9`):** Xanh ngọc biển sâu, dùng cho tiến trình nhạc, họa tiết hình tròn/lượn sóng, nút chỉnh thông số phụ.
*   **Màu nhấn nền (`TERTIARY` - `#4d44b5`):** Xanh chàm đậm hoàng gia, dùng làm nền phụ hoặc phối hợp cùng các họa tiết trừu tượng (như các nét quét cọ sọc chéo).
*   **Nền thẻ/container (`SURFACE` - `#18181c`):** Màu xám đậm đặc cứng cáp làm nền cho danh sách bài hát hoặc các thẻ thông tin phụ.

---

## 2. Kế hoạch Thiết kế lại các Trang (Redesign Implementation Plan)

Dưới đây là kế hoạch chuyển đổi giao diện hiện tại sang giao diện Caziq Neo-Vibrant chi tiết cho từng màn hình:

### Màn hình 1: Trang chủ / Khám phá (Featured / Home Screen)
*   **Thanh công cụ trên cùng (Header):**
    *   Tiêu đề `"Featured"` in đậm nét chữ Outfit, căn trái.
    *   Nút tìm kiếm dạng Icon mỏng tinh tế ở góc phải trên cùng.
*   **Card Đặc Biệt (Featured Card):**
    *   Sử dụng màu nền cam `#ff5a14` rực rỡ, chiếm trọn 1/3 màn hình dọc.
    *   Nửa bên trái hiển thị tên nghệ sĩ phụ `"Beres Hammondme"` màu đen/trắng và tên bài hát nổi bật `"Is This The Right Way?"` kích thước lớn.
    *   Nửa bên phải hiển thị ảnh đè lên lớp khung màu cam với góc bo `rounded-lg`.
*   **Danh sách "Playlists for You" (Cuộn ngang):**
    *   Từng thẻ playlist có tỷ lệ vuông (`aspect-ratio: 1`).
    *   Ảnh bìa thiết kế bằng các mảng màu đồ họa giao thoa giữa **Cam san hô**, **Xanh ngọc** và **Xanh chàm** với họa tiết lượn sóng hoặc sọc chéo.
    *   Chữ mô tả playlist in đậm chữ trắng và đặt ở sát cạnh dưới ảnh bìa.
*   **Thanh phát nhạc nhanh (In the Mix - Mini Player):**
    *   Được thiết kế phẳng nằm ngay trên thanh Bottom Tab.
    *   Viền bo góc rộng, hiển thị bài hát hiện tại, tên nghệ sĩ, thanh tiến trình siêu mỏng màu xanh ngọc `#00e5c9` chạy dưới cùng.
    *   Tích hợp nút chơi nhạc nhanh và nút ẩn (`X`) màu cam san hô.

### Màn hình 2: Danh sách Bài hát (Trending Now - Songs Screen)
*   **Khối tiêu đề (Category Header):**
    *   Nhãn phụ `"Trending Now"` nhỏ phía trên.
    *   Tiêu đề chính `"Songs"` kích thước lớn đậm.
    *   Mô tả nhỏ `"Caziq Music • 30 songs"` màu xám nhạt.
*   **Thanh điều khiển nhanh (Floating Controls Bar):**
    *   Nằm ngang phía trên danh sách bài hát.
    *   Gồm nút **Sắp xếp/Bộ lọc**, nút **Phát ngẫu nhiên (Shuffle)** bo tròn góc màu xám tối `#18181c`.
    *   Nút **Phát (Play) hình tròn lớn** đặc biệt ở phía bên phải có màu nền trắng `#ffffff` và tam giác chơi nhạc màu đen để tạo sự tương phản tối đa.
*   **Danh sách bài hát:**
    *   Ảnh thu nhỏ (thumbnail) bài hát bo tròn góc nhẹ.
    *   Tên bài hát chữ trắng, tên nghệ sĩ và thể loại chữ xám nhạt.
    *   Thời lượng hiển thị bên phải, kết thúc bằng icon 3 dấu chấm dọc tinh tế.

### Màn hình 3: Lưới Danh sách Phát (Trending Now - Playlists Screen)
*   **Khối tiêu đề (Category Header):**
    *   Nhãn phụ `"Trending Now"`. Tiêu đề chính `"Playlists"`. Mô tả `"Caziq Music • 20 playlists"`.
*   **Lưới 3 cột (3-Column Grid):**
    *   Hiển thị danh sách các Playlist dạng lưới 3 cột đều đặn.
    *   Mỗi item là ảnh vuông bo góc nhẹ (`rounded-md`).
    *   Họa tiết ảnh bìa sử dụng style trừu tượng đặc trưng của thương hiệu (Sọc sần sùi chéo, Chấm bi nghệ thuật, Sóng vỗ màu Neon).
    *   Tiêu đề Playlist được đặt ngay dưới ảnh bìa bằng chữ trắng cỡ nhỏ sắc nét.

### Màn hình 4: Chi tiết Album / Podcast (Album / Podcast Detail Screen)
*   **Khối bìa trên cùng (Header Banner Section):**
    *   Chiếm nửa trên màn hình. Thiết kế mảng màu trơn chuyển tiếp lên tông nền tối.
    *   Bên trái hiển thị ảnh vuông đại diện lớn của Podcast/Album.
    *   Tiêu đề lớn `"Mucho Success"` in đậm màu trắng, theo sau là dòng thông tin `"89 podcasts • 1234 followers"`.
    *   Mô tả ngắn gọn về Album/Podcast hiển thị dạng chữ xám nhỏ căn lề trái.
*   **Các nút tương tác chính:**
    *   Nút `"Follow"` dạng viên thuốc dẹt màu xám tối.
    *   Nút Chia sẻ (Share) và Nút phát ngẫu nhiên (Shuffle).
    *   Nút Phát chính (Play button) dạng tròn màu trắng nổi bật ngoài cùng bên phải.
*   **Danh sách tập/bài hát:**
    *   Bản ghi đang phát hiển thị icon màu cam `#ff5a14` kèm thời gian.
    *   Các bản ghi khác hiển thị icon Play mờ và thời lượng màu xám.
    *   Layout căn đều dọc theo thứ tự thời gian từ mới nhất đến cũ nhất.

---

## 3. Các bước thực hiện (Next Steps & Milestones)

1.  **Bước 1:** Thay đổi toàn bộ hằng số màu sắc trong file `Colors.ts` (ĐÃ HOÀN THÀNH).
2.  **Bước 2:** Cập nhật file cấu hình Theme hoặc định dạng Style chung của Expo-router tại file `theme.ts`.
3.  **Bước 3:** Chỉnh sửa giao diện trang Home (`app/(tabs)/index.tsx` hoặc tương đương) thiết kế lại BannerSection và PlaylistsForYou.
4.  **Bước 4:** Thiết kế lại màn hình chi tiết bài hát, lưới danh sách phát và chi tiết album theo đúng cấu hình Caziq Neo-Vibrant.