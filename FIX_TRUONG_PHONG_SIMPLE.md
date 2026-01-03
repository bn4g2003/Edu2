# ✅ ĐÃ FIX: Trưởng phòng xem Dashboard

## 🎯 Giải pháp đơn giản

Thay vì kiểm tra `managerId` trong Firestore (phức tạp), giờ chỉ cần kiểm tra **position** của user:

```typescript
// ✅ Đơn giản: Kiểm tra position
if (userProfile.position === 'Trưởng phòng' && userProfile.departmentId) {
  setPermissions(DEFAULT_ROLES.MANAGER.permissions);
  return;
}
```

## 📋 Điều kiện để trưởng phòng có đầy đủ quyền:

1. ✅ `position` = "Trưởng phòng"
2. ✅ `departmentId` có giá trị
3. ✅ `approved` = true

## 🔑 Quyền của trưởng phòng:

- ✅ `view_dashboard` - Xem Dashboard
- ✅ `view_users` - Xem danh sách nhân viên (của phòng mình)
- ✅ `view_courses` - Xem khóa học (của phòng mình)
- ✅ `view_own_department` - Xem phòng ban của mình
- ✅ `manage_own_department` - Quản lý nhân viên trong phòng
- ✅ `view_salary` - Xem lương

## 🚀 Cách test:

1. Đăng nhập với tài khoản có:
   - `position: "Trưởng phòng"`
   - `departmentId: "dept_xxx"`
   - `approved: true`

2. Kiểm tra:
   - ❌ KHÔNG thấy menu "Tổng quan" (chỉ admin mới thấy)
   - ✅ Thấy menu "Học bài"
   - ✅ Thấy menu "Quản lý người dùng" (chỉ nhân viên phòng mình)
   - ✅ Thấy menu "Quản lý khóa học" (chỉ khóa học phòng mình)
   - ✅ Thấy menu "Lương"

## 📝 Thay đổi đã thực hiện:

### 1. `contexts/PermissionContext.tsx`
- Kiểm tra `position === 'Trưởng phòng'` trước khi query Firestore
- Tự động cấp quyền MANAGER cho trưởng phòng

### 2. `components/admin/UserManagement.tsx`
- Load đầy đủ `managerId` và `managerName` từ departments
- Logic lọc nhân viên theo phòng ban hoạt động đúng

### 3. `components/admin/DashboardSimple.tsx`
- Thay LineChart → Grouped Bar Chart (tối ưu hơn cho so sánh phòng ban)

### 4. `components/admin/AdminLayout.tsx`
- Thêm logic `hideForManager` để ẩn tab "Tổng quan" với trưởng phòng
- Kiểm tra `userProfile?.position === 'Trưởng phòng'`

---

**Ngày fix:** 2024-11-27
**Trạng thái:** ✅ Hoàn thành
