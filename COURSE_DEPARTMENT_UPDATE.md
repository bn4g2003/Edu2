# Cập nhật hệ thống khóa học theo phòng ban

## 📋 Tổng quan thay đổi

### 1. Khóa học theo phòng ban
- ✅ Thêm trường `departmentId` vào Course
- ✅ Khóa học có thể gán cho một phòng ban cụ thể hoặc tất cả phòng ban
- ✅ Nhân viên chỉ thấy khóa học của phòng ban mình

### 2. Bỏ hệ thống đăng ký chờ duyệt
- ✅ Xóa trường `students` và `pendingStudents` khỏi Course
- ✅ Nhân viên tự động thấy và học các khóa thuộc phòng ban
- ✅ Không cần đăng ký hay chờ duyệt

### 3. Tags cho bài học
- ✅ Thêm trường `tags` vào Lesson (mảng string)
- ✅ UI thêm/xóa tags trong form quản lý bài học
- ✅ Hiển thị tags trong danh sách bài học

## 🔧 Chi tiết thay đổi

### Types

**types/course.ts**
```typescript
export interface Course {
  // ... các trường khác
  departmentId?: string; // Phòng ban được xem khóa học này
  // Đã xóa: students, pendingStudents
}
```

**types/lesson.ts**
```typescript
export interface Lesson {
  // ... các trường khác
  tags?: string[]; // Tags cho bài học
}
```

### Components

**components/admin/CourseManagement.tsx**
- Thêm dropdown chọn phòng ban khi tạo/sửa khóa học
- Hiển thị phòng ban trong bảng danh sách khóa học
- Xóa các chức năng quản lý học viên (enrollment)

**components/student/CourseEnrollment.tsx**
- Lọc khóa học theo `departmentId` của user
- Nếu user có phòng ban: hiển thị khóa học của phòng ban đó + khóa học chung
- Nếu user không có phòng ban: chỉ hiển thị khóa học chung
- Bỏ logic đăng ký/chờ duyệt

**components/student/CourseCard.tsx**
- Đơn giản hóa: chỉ có nút "Học ngay"
- Bỏ các trạng thái enrolled/pending
- Bỏ hiển thị số lượng học viên

**components/teacher/LessonManagement.tsx**
- Thêm input tags trong form tạo/sửa bài học
- Hiển thị tags trong danh sách bài học
- Hỗ trợ thêm/xóa tags

## 🎯 Cách sử dụng

### Quản lý khóa học (Admin)
1. Vào "Quản lý khóa học"
2. Tạo/sửa khóa học
3. Chọn phòng ban (hoặc để trống cho tất cả phòng ban)
4. Lưu

### Học viên
1. Vào tab "Học bài"
2. **Tự động thấy CHÍNH XÁC các khóa học của phòng ban mình**
3. **Các khóa học của phòng ban khác sẽ BỊ ẨN hoàn toàn**
4. Khóa học không có phòng ban (chung) thì tất cả đều thấy
5. Click "Học ngay" để bắt đầu học
6. Badge màu tím hiển thị tên phòng ban của khóa học

### Quản lý bài học (Teacher/Admin)
1. Vào chi tiết khóa học
2. Tạo/sửa bài học
3. Thêm tags (ví dụ: "cơ bản", "quan trọng", "nâng cao")
4. Tags sẽ hiển thị dưới dạng badge màu xanh

## 📊 Ví dụ

### Khóa học theo phòng ban
- Khóa "An toàn lao động" → Phòng Sản xuất
  - ✅ Nhân viên Phòng Sản xuất: THẤY
  - ❌ Nhân viên Phòng Kinh doanh: KHÔNG THẤY
  - ❌ Nhân viên Phòng IT: KHÔNG THẤY
  
- Khóa "Kỹ năng bán hàng" → Phòng Kinh doanh
  - ❌ Nhân viên Phòng Sản xuất: KHÔNG THẤY
  - ✅ Nhân viên Phòng Kinh doanh: THẤY
  - ❌ Nhân viên Phòng IT: KHÔNG THẤY
  
- Khóa "Văn hóa công ty" → Không có phòng ban (chung)
  - ✅ Tất cả nhân viên: THẤY

### Tags cho bài học
- Bài 1: ["cơ bản", "bắt buộc"]
- Bài 2: ["nâng cao", "tùy chọn"]
- Bài 3: ["quan trọng", "thực hành"]

## 🗑️ Đã xóa

- Collection `enrollments` (không còn dùng)
- Component `CourseStudentManagement`
- Component `StudentApprovalPage`
- Logic đăng ký/duyệt khóa học
- Hiển thị số lượng học viên trong khóa học

## 📁 Files đã thay đổi

- `types/course.ts`
- `types/lesson.ts`
- `components/admin/CourseManagement.tsx`
- `components/student/CourseEnrollment.tsx`
- `components/student/CourseCard.tsx`
- `components/teacher/LessonManagement.tsx`
