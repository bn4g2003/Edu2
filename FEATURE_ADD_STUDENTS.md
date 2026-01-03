# Tính năng: Thêm học viên vào khóa học

## Mô tả
Admin có thể chủ động thêm học viên vào khóa học mà không cần họ phải đăng ký.

## Cách sử dụng

### Từ trang Quản lý khóa học:
1. Đăng nhập với tài khoản Admin
2. Vào menu "Quản lý khóa học"
3. Tìm khóa học cần thêm học viên
4. Click nút **"Thêm HV"** (màu xanh lá) trong cột Thao tác
5. Chọn học viên từ danh sách (có thể chọn nhiều người)
6. Click "Thêm" để xác nhận

### Các chức năng:
- ✅ Xem danh sách học viên hiện tại trong khóa học
- ✅ Thêm nhiều học viên cùng lúc (checkbox)
- ✅ Tìm kiếm học viên theo tên hoặc email
- ✅ Xóa học viên khỏi khóa học
- ✅ Hiển thị role của từng người (Admin, Nhân viên, Giáo viên, Học viên)

## Lưu ý
- Có thể thêm bất kỳ user nào (không phân biệt role)
- Học viên được thêm trực tiếp vào mảng `students` (đã được duyệt)
- Khác với "Duyệt khóa học" - tính năng này thêm trực tiếp, không qua bước chờ duyệt

## Components
- `CourseManagement.tsx` - Thêm nút "Thêm HV" và logic hiển thị
- `CourseStudentManagement.tsx` - Component quản lý học viên cho khóa học
