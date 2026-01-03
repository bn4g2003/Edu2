# Sửa lỗi tính tổng thời gian học

## 🐛 Vấn đề
Tổng thời gian đã học ở trang quản lý nhân viên bị sai (hiển thị 0 giờ hoặc không chính xác).

## 🔍 Nguyên nhân
Hàm `calculateLearningTime` trong `UserManagement.tsx` đang truy vấn sai collection:
- **Sai**: `collection(db, 'lessonProgress')` - Collection này không tồn tại hoặc rỗng
- **Đúng**: `collection(db, 'progress')` - Collection thực tế đang lưu tiến độ học

## ✅ Giải pháp đã áp dụng

### 1. Sửa collection name trong UserManagement.tsx
```typescript
// Trước (SAI):
const progressRef = collection(db, 'lessonProgress');

// Sau (ĐÚNG):
const progressRef = collection(db, 'progress');
```

### 2. Cập nhật Firestore Rules
Xóa rule không cần thiết cho collection `lessonProgress` trong `firestore.rules`.

### 3. Thêm documentation cho type
Cập nhật `types/progress.ts` với comment giải thích rõ ràng về collection name và cấu trúc dữ liệu.

## 📊 Cách tính thời gian học

Hệ thống tính tổng thời gian học bằng cách:
1. Query tất cả bản ghi trong collection `progress` với `userId` tương ứng
2. Cộng tổng `watchedSeconds` từ tất cả các bài học
3. Chuyển đổi từ giây sang giờ: `totalSeconds / 3600`

**Lưu ý**: Mỗi bài học chỉ có 1 bản ghi duy nhất với ID format: `${userId}_${courseId}_${lessonId}`

## 🧪 Kiểm tra

Sau khi sửa, vào trang Quản lý người dùng và:
1. Click nút "Cập nhật giờ học" để refresh dữ liệu
2. Kiểm tra cột "Giờ học" trong bảng
3. Click vào một user để xem chi tiết thời gian học (giờ, phút, giây)

## 📁 Files đã thay đổi
- `components/admin/UserManagement.tsx` - Sửa collection name
- `firestore.rules` - Xóa rule không dùng
- `types/progress.ts` - Thêm documentation
