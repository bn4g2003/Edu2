# Debug: Tự động cập nhật học viên

## 🔍 Cách kiểm tra

### Bước 1: Mở Console
1. Mở trình duyệt (Chrome/Edge)
2. Nhấn F12 để mở DevTools
3. Chọn tab "Console"

### Bước 2: Tạo/Sửa khóa học
1. Vào "Quản lý khóa học"
2. Click "Thêm khóa học" hoặc "Sửa" một khóa học
3. Chọn **Đối tượng học**:
   - "Chung" để test tất cả nhân viên
   - Một phòng ban cụ thể
4. Click "Lưu"

### Bước 3: Xem logs trong Console

Bạn sẽ thấy các logs như sau:

```
💾 Saving course with departmentId: all
📊 Total users in database: 15
🎯 Selected departmentId: all
🌐 Chung - Found users: 12
✅ Students to be saved: 12 ["user_001", "user_002", ...]
```

Hoặc với phòng ban cụ thể:

```
💾 Saving course with departmentId: dept_123
📊 Total users in database: 15
🎯 Selected departmentId: dept_123
🏢 Phòng ban dept_123 - Found users: 5
Users: [
  { uid: "user_001", name: "Nguyễn Văn A", dept: "dept_123" },
  { uid: "user_002", name: "Trần Thị B", dept: "dept_123" },
  ...
]
✅ Students to be saved: 5 ["user_001", "user_002", ...]
```

## 🐛 Các vấn đề thường gặp

### Vấn đề 1: Không có học viên nào (students: [])

**Nguyên nhân có thể:**
- Users không có field `approved: true`
- Users không có `departmentId` khớp
- Users có `role` không phải staff/teacher/student

**Giải pháp:**
1. Kiểm tra dữ liệu users trong Firestore
2. Đảm bảo users có:
   - `approved: true` (hoặc `role: 'admin'`)
   - `departmentId` khớp với khóa học
   - `role` là 'staff', 'teacher', hoặc 'student'

### Vấn đề 2: Số lượng học viên không đúng

**Kiểm tra:**
```javascript
// Trong Console, chạy lệnh này để xem tất cả users:
const usersRef = collection(db, 'users');
const snapshot = await getDocs(usersRef);
snapshot.docs.forEach(doc => {
  const data = doc.data();
  console.log({
    uid: data.uid,
    name: data.displayName,
    role: data.role,
    dept: data.departmentId,
    approved: data.approved
  });
});
```

### Vấn đề 3: Khóa học cũ không có students

**Giải pháp:**
1. Vào "Quản lý khóa học"
2. Click nút **"Cập nhật học viên"** (màu xanh dương)
3. Xác nhận → Hệ thống sẽ cập nhật lại TẤT CẢ khóa học

## 📊 Kiểm tra dữ liệu trong Firestore

### Cấu trúc Course phải có:
```javascript
{
  id: "course_001",
  title: "Tên khóa học",
  departmentId: "all" | "dept_123" | null,
  students: ["user_001", "user_002", ...],
  // ... các field khác
}
```

### Cấu trúc User phải có:
```javascript
{
  uid: "user_001",
  displayName: "Nguyễn Văn A",
  email: "a@example.com",
  role: "staff" | "teacher" | "student" | "admin",
  departmentId: "dept_123", // Bắt buộc nếu muốn vào khóa học phòng ban
  approved: true, // Bắt buộc (trừ admin)
  // ... các field khác
}
```

## 🔧 Sửa lỗi thủ công

### Nếu cần thêm học viên thủ công vào Firestore:

1. Vào Firestore Console
2. Chọn collection `courses`
3. Chọn document của khóa học
4. Sửa field `students`:
   ```
   students: ["user_001", "user_002", "user_003"]
   ```

### Nếu cần cập nhật departmentId cho users:

1. Vào Firestore Console
2. Chọn collection `users`
3. Chọn document của user
4. Thêm/sửa field:
   ```
   departmentId: "dept_123"
   approved: true
   ```

## ✅ Test checklist

- [ ] Tạo khóa học "Chung" → Kiểm tra `students` có tất cả nhân viên
- [ ] Tạo khóa học cho "Phòng IT" → Kiểm tra `students` chỉ có nhân viên IT
- [ ] Tạo khóa học "Nháp" (không chọn) → Kiểm tra `students` rỗng
- [ ] Sửa khóa học từ "Phòng IT" sang "Chung" → Kiểm tra `students` được cập nhật
- [ ] Click "Cập nhật học viên" → Kiểm tra tất cả khóa học được cập nhật
- [ ] Học viên vào trang "Học bài" → Kiểm tra chỉ thấy khóa học phù hợp

## 📞 Nếu vẫn không hoạt động

Gửi cho tôi:
1. Screenshot Console logs
2. Screenshot Firestore data (courses và users)
3. Mô tả chi tiết vấn đề
