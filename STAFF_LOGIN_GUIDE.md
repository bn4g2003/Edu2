# Hướng dẫn Đăng nhập Nhân viên với Phân quyền

## Luồng hoạt động

### 1. Đăng nhập
```
Nhân viên login → Auth kiểm tra role
  ├─ Admin → /admin (tất cả quyền)
  ├─ Staff → /staff (quyền theo phòng ban)
  ├─ Teacher → /teacher
  └─ Student → /student
```

### 2. Load quyền
```
Staff page → PermissionContext
  → Load department của user
    → Load permissions của department
      → Hiển thị menu phù hợp
```

### 3. Truy cập chức năng
```
Staff click vào menu
  → Redirect đến /admin?menu=xxx
    → ProtectedRoute check permission
      ├─ Có quyền → Hiển thị trang
      └─ Không quyền → Hiển thị "Không có quyền"
```

---

## Cách thiết lập quyền cho nhân viên

### Bước 1: Tạo phòng ban
1. Admin đăng nhập
2. Vào "Quản lý phòng ban"
3. Tạo phòng ban mới (VD: Phòng Kế toán)

### Bước 2: Phân quyền cho phòng ban
1. Click icon **Shield** (🛡️) trên card phòng ban
2. Chọn các quyền muốn cấp:
   - ✅ view_dashboard
   - ✅ view_salary
   - ✅ manage_salary
3. Lưu lại

### Bước 3: Thêm nhân viên vào phòng ban
1. Vào "Quản lý người dùng"
2. Thêm/Sửa nhân viên
3. Chọn **Phòng ban**: Phòng Kế toán
4. Nhập lương tháng
5. Lưu lại

### Bước 4: Nhân viên đăng nhập
1. Nhân viên login với tài khoản
2. Tự động redirect đến `/staff`
3. Thấy trang Staff Portal với các menu được phép:
   - Tổng quan ✅
   - Quản lý lương ✅
4. Click vào menu để truy cập

---

## Ví dụ thực tế

### Phòng Kế toán
**Quyền được cấp:**
- view_dashboard
- view_salary
- manage_salary

**Nhân viên kế toán sẽ thấy:**
- ✅ Tổng quan
- ✅ Quản lý lương
- ❌ Quản lý người dùng (không có quyền)
- ❌ Quản lý khóa học (không có quyền)

### Phòng Nhân sự
**Quyền được cấp:**
- view_dashboard
- view_users
- manage_users
- view_departments

**Nhân viên nhân sự sẽ thấy:**
- ✅ Tổng quan
- ✅ Quản lý người dùng
- ✅ Quản lý phòng ban
- ❌ Quản lý lương (không có quyền)

### Phòng Đào tạo
**Quyền được cấp:**
- view_dashboard
- view_courses
- manage_courses
- view_users

**Nhân viên đào tạo sẽ thấy:**
- ✅ Tổng quan
- ✅ Quản lý khóa học
- ✅ Xem người dùng
- ❌ Quản lý lương (không có quyền)

---

## Giao diện Staff Portal

### Trang chủ (/staff)
- **Header**: Tên nhân viên, email, nút đăng xuất
- **Welcome banner**: Chào mừng với gradient đẹp
- **Permissions info**: Hiển thị tất cả quyền của nhân viên
- **Available menus**: Grid cards cho các chức năng được phép
- **No permission state**: Thông báo nếu chưa có quyền

### Khi click vào menu
- Redirect đến `/admin?menu=xxx`
- ProtectedRoute kiểm tra quyền
- Hiển thị trang nếu có quyền
- Hiển thị "Không có quyền" nếu không được phép

---

## Phân biệt Admin vs Staff

### Admin
- **Route**: `/admin`
- **Quyền**: Tất cả
- **Menu**: Hiển thị tất cả
- **Sidebar**: Fixed sidebar với tất cả menu

### Staff
- **Route**: `/staff` (landing page)
- **Quyền**: Theo phòng ban
- **Menu**: Chỉ hiển thị menu có quyền
- **Navigation**: Click card → redirect đến admin page với menu tương ứng

---

## Trường hợp đặc biệt

### Trưởng phòng
- Có quyền của phòng ban
- **PLUS** quyền manager mặc định:
  - view_dashboard
  - view_users
  - view_courses
  - view_own_department
  - manage_own_department
  - view_salary

### Nhân viên không có phòng ban
- Chỉ có quyền mặc định:
  - view_dashboard
  - view_courses
  - view_own_department

### Nhân viên có phòng ban nhưng phòng ban chưa có quyền
- Chỉ có quyền mặc định của staff
- Admin cần phân quyền cho phòng ban

---

## Testing

### Test case 1: Nhân viên kế toán
1. Tạo phòng Kế toán với quyền: view_salary, manage_salary
2. Thêm nhân viên vào phòng Kế toán
3. Login với tài khoản nhân viên
4. Kiểm tra: Chỉ thấy menu Tổng quan và Quản lý lương

### Test case 2: Trưởng phòng
1. Tạo phòng ban
2. Thêm nhân viên và set làm trưởng phòng (managerId)
3. Login với tài khoản trưởng phòng
4. Kiểm tra: Có thêm quyền manager

### Test case 3: Nhân viên không có phòng ban
1. Tạo nhân viên không chọn phòng ban
2. Login
3. Kiểm tra: Chỉ có quyền mặc định

---

## Files

### Mới:
- `components/staff/StaffDashboard.tsx` - Trang chủ nhân viên
- `app/staff/page.tsx` - Route cho nhân viên
- `components/admin/DepartmentPermissions.tsx` - UI phân quyền phòng ban

### Cập nhật:
- `types/department.ts` - Thêm field permissions
- `contexts/PermissionContext.tsx` - Load quyền từ phòng ban
- `components/Auth.tsx` - Redirect staff đến /staff
- `app/admin/page.tsx` - Cho phép staff truy cập, đọc menu từ URL
- `components/admin/DepartmentManagement.tsx` - Thêm nút phân quyền

---

## Security

⚠️ **Lưu ý:**
- Quyền chỉ kiểm soát UI (ẩn/hiện menu)
- Firestore rules phải validate lại ở backend
- Không tin tưởng hoàn toàn client-side checks

### Firestore Rules cần cập nhật:
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.token.role == 'admin' ||
               (request.auth.token.role == 'staff' && 
                hasPermission(request.auth.uid, 'manage_users'));
}
```

---

## Troubleshooting

### Nhân viên không thấy menu nào
**Kiểm tra:**
1. Nhân viên đã được thêm vào phòng ban chưa?
2. Phòng ban đã được phân quyền chưa?
3. Logout và login lại

### Menu hiển thị nhưng không truy cập được
**Kiểm tra:**
1. ProtectedRoute có đúng permission không?
2. Console log xem permissions có load đúng không
3. Refresh trang

### Trưởng phòng không có quyền đặc biệt
**Kiểm tra:**
1. User có được set làm managerId của phòng ban không?
2. Check trong Firestore: departments/{deptId}/managerId
