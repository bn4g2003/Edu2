# Tính năng Quản lý Phòng ban và Lương

## 1. Quản lý Phòng ban ✅

### Tính năng:
- ✅ Thêm/Sửa/Xóa phòng ban
- ✅ Chọn trưởng phòng từ danh sách nhân viên
- ✅ Hiển thị số lượng nhân viên trong phòng ban
- ✅ Mô tả chi tiết về phòng ban

### Cách sử dụng:
1. Vào menu "Quản lý phòng ban"
2. Click "Thêm phòng ban" để tạo mới
3. Nhập tên, mô tả và chọn trưởng phòng
4. Lưu lại

### Files:
- `components/admin/DepartmentManagement.tsx` (cập nhật)
- `types/department.ts` (mới)

---

## 2. Quản lý Người dùng - Thêm Phòng ban & Lương ✅

### Tính năng:
- ✅ Chọn phòng ban khi thêm/sửa nhân viên
- ✅ Nhập lương tháng cơ bản cho nhân viên
- ✅ Hiển thị phòng ban và lương trong bảng danh sách
- ✅ Chỉ hiển thị cho role = "staff"

### Cách sử dụng:
1. Vào menu "Quản lý người dùng"
2. Thêm/Sửa người dùng với role = "Nhân viên"
3. Chọn phòng ban từ dropdown
4. Nhập lương tháng (VD: 10000000)
5. Lưu lại

### Cấu trúc dữ liệu:
```typescript
interface UserProfile {
  // ... các field cũ
  departmentId?: string;    // ID phòng ban
  monthlySalary?: number;   // Lương tháng cơ bản
}
```

### Files:
- `components/admin/UserManagement.tsx` (cập nhật)
- `types/user.ts` (cập nhật)

---

## 3. Quản lý Lương - Tính lương theo công ✅

### Tính năng:
- ✅ Chọn tháng để xem/tính lương
- ✅ Hiển thị danh sách nhân viên với lương cơ bản
- ✅ Nhập số ngày nghỉ và số ngày đi muộn
- ✅ Tự động tính toán:
  - **Lương ngày** = Lương tháng / 26 ngày
  - **Trừ nghỉ** = Lương ngày × Số ngày nghỉ
  - **Trừ đi muộn** = (Lương ngày / 2) × Số ngày đi muộn
  - **Lương thực nhận** = Lương cơ bản - Tổng trừ
- ✅ Preview lương trước khi lưu
- ✅ Ghi chú thêm cho từng bản lương
- ✅ Thống kê tổng quan

### Công thức tính:
```
Lương ngày = Lương tháng / 26
Trừ nghỉ = Lương ngày × Số ngày nghỉ
Trừ đi muộn = (Lương ngày / 2) × Số ngày đi muộn
Lương thực nhận = Lương cơ bản - (Trừ nghỉ + Trừ đi muộn)
```

### Ví dụ:
- Lương tháng: 10,000,000đ
- Lương ngày: 10,000,000 / 26 = 384,615đ
- Nghỉ 2 ngày: 384,615 × 2 = 769,230đ
- Đi muộn 3 ngày: (384,615 / 2) × 3 = 576,923đ
- Tổng trừ: 769,230 + 576,923 = 1,346,153đ
- Thực nhận: 10,000,000 - 1,346,153 = 8,653,847đ

### Cách sử dụng:
1. Vào menu "Quản lý lương"
2. Chọn tháng cần tính lương
3. Click "Nhập" hoặc "Sửa" cho từng nhân viên
4. Nhập số ngày nghỉ và số ngày đi muộn
5. Xem preview lương thực nhận
6. Lưu lại

### Thống kê hiển thị:
- Tổng nhân viên
- Số nhân viên đã tính lương
- Tổng lương cơ bản
- Tổng lương thực nhận

### Cấu trúc dữ liệu:
```typescript
interface SalaryRecord {
  id: string;
  userId: string;
  userName: string;
  departmentId?: string;
  departmentName?: string;
  month: string;              // Format: YYYY-MM
  baseSalary: number;         // Lương cơ bản
  workingDays: number;        // 26 ngày
  absentDays: number;         // Số ngày nghỉ
  lateDays: number;           // Số ngày đi muộn
  deduction: number;          // Số tiền trừ
  finalSalary: number;        // Lương thực nhận
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Files:
- `components/admin/SalaryManagementNew.tsx` (mới)
- `types/salary.ts` (mới)
- `app/admin/page.tsx` (cập nhật để sử dụng component mới)

---

## Firestore Collections

### 1. departments
```javascript
{
  id: "dept_123",
  name: "Phòng Kỹ thuật",
  description: "Phòng phát triển sản phẩm",
  managerId: "user_456",
  managerName: "Nguyễn Văn A",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. users (cập nhật)
```javascript
{
  uid: "user_123",
  email: "staff@example.com",
  displayName: "Nguyễn Văn B",
  role: "staff",
  departmentId: "dept_123",      // Mới
  monthlySalary: 10000000,       // Mới
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 3. salaryRecords (mới)
```javascript
{
  id: "user_123_2024-01",
  userId: "user_123",
  userName: "Nguyễn Văn B",
  departmentId: "dept_123",
  month: "2024-01",
  baseSalary: 10000000,
  workingDays: 26,
  absentDays: 2,
  lateDays: 3,
  deduction: 1346153,
  finalSalary: 8653847,
  note: "Nghỉ ốm 2 ngày",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Lưu ý

1. **Phòng ban:**
   - Trưởng phòng phải là nhân viên (role = staff)
   - Có thể có phòng ban không có trưởng phòng
   - Xóa phòng ban không ảnh hưởng đến nhân viên

2. **Lương:**
   - Chỉ nhân viên (role = staff) mới có lương
   - Lương tháng phải được nhập trước khi tính công
   - Mỗi tháng có thể sửa lại nhiều lần
   - Ngày nghỉ trừ 100% lương ngày
   - Ngày đi muộn trừ 50% lương ngày

3. **Tính toán:**
   - Tháng có 26 ngày công chuẩn
   - Lương không thể âm (tối thiểu = 0)
   - Số ngày nghỉ + đi muộn không được vượt quá 26

---

## Các bước triển khai

1. ✅ Tạo types mới (Department, SalaryRecord)
2. ✅ Cập nhật UserProfile với departmentId và monthlySalary
3. ✅ Hoàn thiện DepartmentManagement
4. ✅ Cập nhật UserManagement để chọn phòng ban và nhập lương
5. ✅ Tạo SalaryManagementNew với tính năng tính lương theo công
6. ✅ Tích hợp vào admin page

---

## TODO (Tùy chọn)

- [ ] Export bảng lương ra Excel
- [ ] Gửi email thông báo lương cho nhân viên
- [ ] Lịch sử thay đổi lương
- [ ] Báo cáo thống kê theo phòng ban
- [ ] Tính thưởng/phạt thêm
- [ ] Tính bảo hiểm, thuế
