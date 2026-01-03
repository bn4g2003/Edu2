# Tóm tắt các cập nhật

## 1. Cố định nút đăng xuất ✅
- Sidebar admin được cố định (fixed position)
- Main content tự động điều chỉnh margin khi sidebar mở/đóng
- Nút đăng xuất luôn hiển thị ở cuối sidebar

**File:** `components/admin/AdminLayout.tsx`

## 2. Upload ảnh Thumbnail qua Bunny Storage ✅
- Component `BunnyImageUpload` cho phép upload ảnh lên Bunny Storage
- Hỗ trợ preview ảnh trước khi upload
- Validate file type và size (max 5MB)
- Tự động tạo CDN URL sau khi upload

**Files:**
- `components/shared/BunnyImageUpload.tsx` (mới)
- `components/admin/CourseManagement.tsx` (cập nhật)

## 3. Video Demo cho khóa học ✅
- Thêm field `demoVideoId` vào Course type
- Component `BunnyVideoUpload` cho phép upload video lên Bunny Stream
- Video demo hiển thị ở đầu trang khi học viên vào khóa học
- Hỗ trợ preview video sau khi upload
- Validate file type và size (max 500MB)

**Files:**
- `types/course.ts` (thêm field `demoVideoId`)
- `components/shared/BunnyVideoUpload.tsx` (mới)
- `components/admin/CourseManagement.tsx` (cập nhật)
- `components/student/CourseViewer.tsx` (cập nhật)

## 4. Banner khóa học (Text-based) ✅
- Banner hiển thị ở đầu trang CourseViewer
- Gradient background (brand colors)
- Hiển thị: Tiêu đề, mô tả, thời lượng, giảng viên, cấp độ
- Responsive và đẹp mắt

**File:** `components/student/CourseViewer.tsx`

## Cấu trúc dữ liệu mới

### Course Interface
```typescript
interface Course {
  // ... các field cũ
  demoVideoId?: string; // Bunny Stream video ID
}
```

## Cách sử dụng

### Upload Thumbnail:
1. Vào "Quản lý khóa học" → Thêm/Sửa khóa học
2. Click vào khung "Thumbnail (Ảnh đại diện)"
3. Chọn file ảnh (PNG, JPG, GIF - max 5MB)
4. Ảnh sẽ tự động upload lên Bunny Storage

### Upload Video Demo:
1. Vào "Quản lý khóa học" → Thêm/Sửa khóa học
2. Click vào khung "Video Demo"
3. Chọn file video (MP4, MOV, AVI - max 500MB)
4. Video sẽ tự động upload lên Bunny Stream
5. Video demo sẽ hiển thị khi học viên vào khóa học

### Xem Banner & Video Demo:
1. Học viên vào khóa học
2. Banner (text) hiển thị ở đầu trang với gradient background
3. Video demo hiển thị ngay dưới banner (nếu có)
4. Khi chọn bài học, video demo sẽ ẩn đi

## Environment Variables cần thiết

```env
# Bunny Storage (cho ảnh)
NEXT_PUBLIC_BUNNY_STORAGE_ZONE=your-storage-zone
NEXT_PUBLIC_BUNNY_STORAGE_PASSWORD=your-password
NEXT_PUBLIC_BUNNY_STORAGE_HOSTNAME=storage.bunnycdn.com
NEXT_PUBLIC_BUNNY_STORAGE_CDN_URL=your-cdn-url.b-cdn.net

# Bunny Stream (cho video)
NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID=your-library-id
NEXT_PUBLIC_BUNNY_STREAM_API_KEY=your-api-key
NEXT_PUBLIC_BUNNY_STREAM_CDN_HOSTNAME=your-cdn-hostname.b-cdn.net
```

## 5. Hiệu ứng hover card khóa học ✅
- Component `CourseCard` với hiệu ứng hover đặc biệt
- Khi di chuột vào card:
  - Card phóng to (scale 105%)
  - Shadow tăng lên
  - Video demo tự động phát (nếu có)
  - Thumbnail mờ dần, video hiện ra
- Khi rời chuột:
  - Card về kích thước ban đầu
  - Video dừng và reset về đầu
  - Thumbnail hiện lại
- Icon Play hiển thị khi có video demo

**Files:**
- `components/student/CourseCard.tsx` (mới)
- `components/student/CourseEnrollment.tsx` (cập nhật để sử dụng CourseCard)

## Lưu ý
- Ảnh và video được upload trực tiếp lên Bunny CDN
- Không lưu file trên server
- URL/Video ID được lưu vào Firestore
- Video demo chỉ hiển thị khi chưa chọn bài học nào
- Video trong card tự động phát khi hover (muted, loop)
- Hiệu ứng smooth với transition 300ms
