# Tính năng Trưởng phòng

## 📋 Tổng quan

Trưởng phòng được tự động nhận diện và có quyền quản lý nhân viên cũng như khóa học của phòng ban mình.

## 🎯 Cách xác định Trưởng phòng

### Tự động dựa trên chức vụ:
```typescript
// Một user là Trưởng phòng khi:
user.position === 'Trưởng phòng' && 
user.departmentId === 'dept_xxx' &&
user.approved === true
```

### Cập nhật tự động:
- Khi tạo/sửa phòng ban → Hệ thống tự động tìm người có chức vụ "Trưởng phòng"
- Khi thay đổi chức vụ nhân viên → Click "Cập nhật trưởng phòng" để refresh

## 🔐 Quyền của Trưởng phòng

### 1. Quản lý Nhân viên
- ✅ Xem danh sách nhân viên **của phòng ban mình**
- ✅ Thêm/sửa/xóa nhân viên trong phòng
- ✅ Xem thống kê giờ học của nhân viên
- ❌ KHÔNG thấy nhân viên phòng ban khác

### 2. Quản lý Khóa học
- ✅ Xem khóa học **của phòng ban mình**
- ✅ Xem khóa học **Chung** (dành cho tất cả)
- ✅ Tạo/sửa/xóa khóa học cho phòng mình
- ❌ KHÔNG thấy khóa học của phòng ban khác

### 3. Các trang khác
- ✅ Học bài (như nhân viên thường)
- ❌ KHÔNG vào được: Dashboard, Quản lý phòng ban, Quản lý lương (trừ khi có quyền)

## 🚀 Cách sử dụng

### Bước 1: Tạo phòng ban
1. Admin vào "Quản lý phòng ban"
2. Click "Thêm phòng ban"
3. Nhập tên và mô tả
4. Lưu

### Bước 2: Thêm nhân viên vào phòng ban
1. Admin vào "Quản lý người dùng"
2. Tạo/sửa nhân viên
3. Chọn **Chức vụ**: "Trưởng phòng"
4. Chọn **Phòng ban**: Phòng cần gán
5. Lưu

### Bước 3: Cập nhật trưởng phòng
1. Vào "Quản lý phòng ban"
2. Click nút **"Cập nhật trưởng phòng"** (màu xanh dương)
3. Hệ thống tự động gán trưởng phòng cho mỗi phòng ban

### Bước 4: Đăng nhập với tài khoản Trưởng phòng
1. Đăng nhập bằng email/password của Trưởng phòng
2. Tự động vào trang quản lý
3. Chỉ thấy nhân viên và khóa học của phòng mình

## 📊 Ví dụ cụ thể

### Ví dụ 1: Phòng IT
```javascript
// Phòng ban
{
  id: "dept_it",
  name: "Phòng IT",
  managerId: "user_001", // Tự động
  managerName: "Nguyễn Văn A" // Tự động
}

// Trưởng phòng
{
  uid: "user_001",
  displayName: "Nguyễn Văn A",
  email: "a@company.com",
  role: "staff",
  position: "Trưởng phòng", // ← Quan trọng!
  departmentId: "dept_it",
  approved: true
}

// Nhân viên trong phòng
{
  uid: "user_002",
  displayName: "Trần Thị B",
  role: "staff",
  position: "Nhân viên",
  departmentId: "dept_it"
}
```

**Khi Nguyễn Văn A đăng nhập:**
- ✅ Thấy: Trần Thị B (cùng phòng)
- ✅ Thấy: Khóa học của Phòng IT
- ✅ Thấy: Khóa học Chung
- ❌ KHÔNG thấy: Nhân viên Phòng Kinh doanh
- ❌ KHÔNG thấy: Khóa học của Phòng Kinh doanh

### Ví dụ 2: Nhiều Trưởng phòng
```javascript
// Nếu có 2 người cùng chức vụ "Trưởng phòng" trong 1 phòng:
// → Hệ thống chọn người đầu tiên tìm thấy
// → Nên chỉ có 1 Trưởng phòng / 1 phòng ban
```

## 🎨 Giao diện

### Trong Quản lý phòng ban:
```
┌─────────────────────────────────────────┐
│ Quản lý phòng ban                       │
│ Trưởng phòng được tự động lấy từ        │
│ nhân viên có chức vụ "Trưởng phòng"     │
│                                         │
│ [Cập nhật trưởng phòng] [Thêm phòng ban]│
└─────────────────────────────────────────┘

| Phòng ban | Trưởng phòng | Nhân viên |
|-----------|--------------|-----------|
| Phòng IT  | Nguyễn Văn A | 5 người   |
| Phòng KD  | Trần Thị B   | 8 người   |
```

### Trong Quản lý người dùng (Trưởng phòng):
```
┌─────────────────────────────────────────┐
│ Quản lý người dùng                      │
│ 🏢 Bạn đang xem nhân viên của phòng ban:│
│    Phòng IT                             │
└─────────────────────────────────────────┘

Chỉ hiển thị nhân viên Phòng IT
```

### Trong Quản lý khóa học (Trưởng phòng):
```
┌─────────────────────────────────────────┐
│ Quản lý khóa học                        │
│ 🏢 Bạn đang xem khóa học của phòng ban: │
│    Phòng IT                             │
└─────────────────────────────────────────┘

Chỉ hiển thị:
- Khóa học của Phòng IT
- Khóa học Chung
```

## 🔧 Cập nhật trưởng phòng

### Khi nào cần cập nhật?
- Khi thêm nhân viên mới với chức vụ "Trưởng phòng"
- Khi thay đổi chức vụ nhân viên
- Khi chuyển nhân viên sang phòng ban khác

### Cách cập nhật:
1. **Tự động**: Khi tạo/sửa phòng ban
2. **Thủ công**: Click nút "Cập nhật trưởng phòng" trong Quản lý phòng ban

## ⚠️ Lưu ý quan trọng

1. **Một phòng ban chỉ nên có 1 Trưởng phòng**
   - Nếu có nhiều người cùng chức vụ → Hệ thống chọn người đầu tiên

2. **Trưởng phòng phải được duyệt**
   - `approved: true` mới được tính

3. **Trưởng phòng phải thuộc phòng ban**
   - `departmentId` phải khớp với phòng ban

4. **Quyền hạn giới hạn**
   - Chỉ quản lý phòng ban mình
   - Không vào được các trang admin khác (trừ khi có quyền riêng)

## 🐛 Troubleshooting

### Vấn đề: Không tìm thấy trưởng phòng
**Kiểm tra:**
- User có `position: "Trưởng phòng"` không?
- User có `departmentId` khớp với phòng ban không?
- User có `approved: true` không?

**Giải pháp:**
1. Vào "Quản lý người dùng"
2. Sửa nhân viên → Chọn chức vụ "Trưởng phòng"
3. Vào "Quản lý phòng ban" → Click "Cập nhật trưởng phòng"

### Vấn đề: Trưởng phòng thấy nhân viên phòng khác
**Nguyên nhân:** Logic filter chưa hoạt động

**Giải pháp:**
- Kiểm tra Console logs
- Đảm bảo `currentUser.position === "Trưởng phòng"`
- Đảm bảo `currentUser.departmentId` có giá trị

## 📁 Files đã thay đổi

- `components/admin/DepartmentManagement.tsx` - Tự động lấy trưởng phòng
- `components/admin/UserManagement.tsx` - Lọc nhân viên theo phòng ban
- `components/admin/CourseManagement.tsx` - Lọc khóa học theo phòng ban
- `types/department.ts` - Đã có sẵn managerId, managerName
