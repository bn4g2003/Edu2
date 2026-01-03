# Tự động cập nhật học viên cho khóa học

## 📋 Tổng quan

Hệ thống tự động cập nhật danh sách học viên (`students`) cho mỗi khóa học dựa trên **Đối tượng học** được chọn.

## 🎯 3 Loại đối tượng học

### 1. 🔒 **Nháp** (Không chọn gì)
- **departmentId**: `undefined` hoặc `null` hoặc `""`
- **students**: `[]` (rỗng)
- **Hiển thị**: Không ai thấy
- **Mục đích**: Khóa học đang soạn thảo, chưa công bố

### 2. 🌐 **Chung** (Tất cả nhân viên)
- **departmentId**: `"all"`
- **students**: Tự động thêm TẤT CẢ nhân viên (staff, teacher, student) đã được duyệt
- **Hiển thị**: Tất cả nhân viên đều thấy
- **Mục đích**: Khóa học chung cho toàn công ty

### 3. 🏢 **Phòng ban cụ thể**
- **departmentId**: ID của phòng ban (ví dụ: `"dept_123"`)
- **students**: Tự động thêm nhân viên thuộc phòng ban đó
- **Hiển thị**: Chỉ nhân viên phòng ban đó thấy
- **Mục đích**: Khóa học riêng cho từng phòng ban

## 🔄 Cơ chế tự động cập nhật

### Khi tạo/sửa khóa học:

```typescript
// Hàm tự động lấy danh sách học viên
const getStudentsForDepartment = async (departmentId: string): Promise<string[]> => {
  if (departmentId === 'all') {
    // Chung: lấy tất cả nhân viên đã duyệt
    return allApprovedUsers.map(u => u.uid);
  } else if (departmentId) {
    // Phòng ban cụ thể: lấy nhân viên của phòng ban đó
    return usersInDepartment.map(u => u.uid);
  } else {
    // Nháp: không có học viên
    return [];
  }
};
```

### Khi lưu khóa học:
1. Admin chọn **Đối tượng học**
2. Hệ thống tự động query database để lấy danh sách user phù hợp
3. Cập nhật trường `students` với danh sách UID
4. Lưu vào Firestore

## 📊 Ví dụ cụ thể

### Ví dụ 1: Khóa học Chung
```javascript
{
  id: "course_001",
  title: "Văn hóa công ty",
  departmentId: "all",
  students: [
    "user_001", // Nhân viên Phòng IT
    "user_002", // Nhân viên Phòng Kinh doanh
    "user_003", // Nhân viên Phòng Sản xuất
    "user_004", // Giáo viên
    "user_005"  // Học viên
  ]
}
```
**Kết quả**: Tất cả 5 người đều thấy khóa học này

### Ví dụ 2: Khóa học Phòng ban
```javascript
{
  id: "course_002",
  title: "An toàn lao động",
  departmentId: "dept_sanxuat",
  students: [
    "user_003", // Nhân viên Phòng Sản xuất
    "user_006"  // Nhân viên Phòng Sản xuất
  ]
}
```
**Kết quả**: 
- ✅ Nhân viên Phòng Sản xuất: THẤY
- ❌ Nhân viên Phòng IT: KHÔNG THẤY
- ❌ Nhân viên Phòng Kinh doanh: KHÔNG THẤY

### Ví dụ 3: Khóa học Nháp
```javascript
{
  id: "course_003",
  title: "Khóa học đang soạn",
  departmentId: null,
  students: []
}
```
**Kết quả**: Không ai thấy (kể cả Admin)

## 🎨 Giao diện

### Trong form tạo/sửa khóa học:
```
Đối tượng học *
┌─────────────────────────────────────┐
│ -- Không hiển thị cho ai --         │ ← Nháp
│ 🌐 Chung (Tất cả nhân viên)         │ ← Chung
│ 🏢 Phòng IT                         │ ← Phòng ban
│ 🏢 Phòng Kinh doanh                 │
│ 🏢 Phòng Sản xuất                   │
└─────────────────────────────────────┘

• Chung: Tất cả nhân viên đều thấy
• Phòng ban cụ thể: Chỉ nhân viên phòng ban đó thấy
• Không chọn: Không ai thấy (nháp)
```

### Trong bảng danh sách khóa học:

| Khóa học | Đối tượng | Học viên |
|----------|-----------|----------|
| Văn hóa công ty | 🌐 Chung | 👥 50 người |
| An toàn lao động | 🏢 Phòng Sản xuất | 👥 12 người |
| Khóa đang soạn | 🔒 Nháp | 👥 0 người |

### Trong card khóa học (học viên):
```
┌─────────────────────────────────┐
│ Văn hóa công ty                 │
│ 🌐 Chung  👥 50 học viên        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ An toàn lao động                │
│ 🏢 Phòng Sản xuất  👥 12 học viên│
└─────────────────────────────────┘
```

## 🔍 Logic lọc khóa học (Học viên)

```typescript
// Trong CourseEnrollment.tsx
if (userProfile?.departmentId) {
  // User có phòng ban: thấy khóa chung + khóa của phòng mình
  coursesData = coursesData.filter(course => 
    course.departmentId === 'all' || 
    course.departmentId === userProfile.departmentId
  );
} else {
  // User không có phòng ban: chỉ thấy khóa chung
  coursesData = coursesData.filter(course => 
    course.departmentId === 'all'
  );
}
```

## 📈 Thống kê & Báo cáo

Với trường `students`, bạn có thể:
- Đếm số lượng học viên của mỗi khóa học
- Xem danh sách học viên đã đăng ký
- Tạo báo cáo tiến độ học tập
- Gửi thông báo cho học viên cụ thể

## ⚠️ Lưu ý quan trọng

1. **Tự động cập nhật**: Mỗi khi sửa `departmentId`, danh sách `students` sẽ được cập nhật lại hoàn toàn
2. **Không thủ công**: Admin không cần thêm/xóa học viên thủ công
3. **Đồng bộ**: Khi có nhân viên mới vào phòng ban, cần cập nhật lại khóa học để thêm họ vào
4. **Nháp**: Khóa học nháp (không chọn đối tượng) sẽ không hiển thị cho ai, kể cả Admin trong trang học bài

## 🚀 Cách sử dụng

### Admin tạo khóa học:
1. Vào "Quản lý khóa học" → "Thêm khóa học"
2. Điền thông tin khóa học
3. Chọn **Đối tượng học**:
   - Chọn "Chung" nếu muốn tất cả nhân viên học
   - Chọn phòng ban cụ thể nếu chỉ cho phòng đó
   - Không chọn gì nếu đang soạn nháp
4. Lưu → Hệ thống tự động thêm học viên

### Học viên xem khóa học:
1. Vào tab "Học bài"
2. Thấy các khóa học:
   - Khóa "Chung" (nếu có)
   - Khóa của phòng ban mình (nếu có)
3. Click "Học ngay" để bắt đầu

## 📁 Files đã thay đổi

- `types/course.ts` - Thêm lại trường `students`
- `components/admin/CourseManagement.tsx` - Logic tự động cập nhật students
- `components/student/CourseEnrollment.tsx` - Logic lọc theo departmentId
- `components/student/CourseCard.tsx` - Hiển thị số lượng học viên
