# 🔧 HƯỚNG DẪN FIX VÀ KIỂM TRA TRƯỞNG PHÒNG

## ✅ ĐÃ FIX

### 1. ✅ Load đầy đủ thông tin departments
**File:** `components/admin/UserManagement.tsx`

**Thay đổi:**
- Thêm `managerId` và `managerName` khi load departments
- Logic lọc nhân viên theo phòng ban giờ sẽ hoạt động đúng

### 2. ✅ Thay đổi sơ đồ Dashboard
**File:** `components/admin/DashboardSimple.tsx`

**Thay đổi:**
- Từ **LineChart** → **Grouped Bar Chart với Dual Axis**
- Dễ so sánh hơn giữa các phòng ban
- 2 trục Y riêng biệt cho các chỉ số có scale khác nhau

---

## 🧪 CÁCH KIỂM TRA

### Bước 1: Kiểm tra dữ liệu trong Firestore

1. Mở Firebase Console → Firestore Database
2. Vào collection `departments`
3. Kiểm tra mỗi department có đủ fields:

```json
{
  "name": "Phòng IT",
  "description": "Phòng công nghệ thông tin",
  "managerId": "user_1234567890",  // ← Phải có
  "managerName": "Nguyễn Văn A",   // ← Phải có
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Nếu thiếu managerId:**
- Vào trang "Quản lý phòng ban"
- Click "Chỉnh sửa" phòng ban
- Chọn trưởng phòng từ dropdown
- Lưu lại

---

### Bước 2: Kiểm tra thông tin User (Trưởng phòng)

1. Vào collection `users`
2. Tìm user là trưởng phòng
3. Kiểm tra có đủ fields:

```json
{
  "uid": "user_1234567890",
  "email": "truongphong@company.com",
  "displayName": "Nguyễn Văn A",
  "role": "staff",                    // ← Phải là "staff"
  "position": "Trưởng phòng",         // ← Chính xác, có dấu
  "departmentId": "dept_it",          // ← Phải có
  "approved": true,                   // ← Phải là true
  "monthlySalary": 15000000,
  "totalLearningHours": 10.5
}
```

**Lưu ý:**
- `position` phải chính xác là `"Trưởng phòng"` (có dấu, viết hoa đúng)
- `departmentId` phải khớp với ID của department
- `approved` phải là `true`

---

### Bước 3: Test chức năng lọc nhân viên

1. **Đăng nhập với tài khoản Admin**
   - Vào "Quản lý người dùng"
   - Xác nhận thấy TẤT CẢ nhân viên

2. **Đăng nhập với tài khoản Trưởng phòng**
   - Vào "Quản lý người dùng"
   - Xác nhận CHỈ thấy nhân viên của phòng mình
   - Phải có thông báo: "🏢 Bạn đang xem nhân viên của phòng ban: [Tên phòng]"

3. **Kiểm tra Console Log**
   - Mở DevTools (F12)
   - Vào tab Console
   - Xem log để debug:

```javascript
// Thêm log tạm thời vào UserManagement.tsx (dòng 145)
console.log('🔍 Debug Manager Check:', {
  currentUser: currentUser?.displayName,
  currentUserDept: currentUser?.departmentId,
  departments: departments,
  isManager: departments.some(d => d.managerId === currentUser?.uid),
  matchingDept: departments.find(d => d.managerId === currentUser?.uid)
});
```

---

### Bước 4: Test quyền xem Dashboard

1. **Đăng nhập với tài khoản Trưởng phòng**
2. Vào trang Admin
3. Kiểm tra menu bên trái:
   - ✅ Phải thấy tab "Dashboard"
   - ✅ Click vào phải hiển thị được

4. **Nếu KHÔNG thấy Dashboard:**
   - Mở Console (F12)
   - Chạy lệnh kiểm tra:

```javascript
// Paste vào Console
const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
console.log('👤 User Info:', {
  name: user.displayName,
  role: user.role,
  position: user.position,
  departmentId: user.departmentId,
  approved: user.approved
});

// Kiểm tra department
fetch('https://firestore.googleapis.com/v1/projects/YOUR_PROJECT/databases/(default)/documents/departments')
  .then(r => r.json())
  .then(data => {
    const dept = data.documents.find(d => d.fields.managerId?.stringValue === user.uid);
    console.log('🏢 Department Info:', dept);
  });
```

---

### Bước 5: Test sơ đồ mới

1. Vào Dashboard
2. Tìm phần "So sánh chỉ số học tập theo phòng ban"
3. Xác nhận:
   - ✅ Hiển thị dạng **cột nhóm** (không phải đường)
   - ✅ Có 2 trục Y (trái và phải)
   - ✅ Dễ so sánh giữa các phòng ban
   - ✅ Legend hiển thị đầy đủ 4 chỉ số

---

## 🐛 TROUBLESHOOTING

### Vấn đề 1: Trưởng phòng vẫn thấy tất cả nhân viên

**Nguyên nhân có thể:**
1. Department không có `managerId` trong Firestore
2. `managerId` không khớp với `uid` của user
3. User không có `departmentId`

**Giải pháp:**
```javascript
// Chạy trong Console để kiểm tra
const checkManager = async () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const deptRef = collection(db, 'departments');
  const snapshot = await getDocs(deptRef);
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`📁 ${data.name}:`, {
      managerId: data.managerId,
      isCurrentUser: data.managerId === user.uid,
      managerName: data.managerName
    });
  });
};
checkManager();
```

---

### Vấn đề 2: Không có quyền xem Dashboard

**Nguyên nhân có thể:**
1. Department không có `managerId`
2. Permission system không load đúng
3. User không được set làm manager

**Giải pháp:**
1. Kiểm tra Firestore: `departments/{deptId}` có `managerId`
2. Kiểm tra PermissionContext có load đúng không
3. Thử logout và login lại

---

### Vấn đề 3: Sơ đồ không hiển thị

**Nguyên nhân có thể:**
1. Không có dữ liệu
2. Lỗi import recharts

**Giải pháp:**
```bash
# Kiểm tra recharts đã cài chưa
npm list recharts

# Nếu chưa có, cài lại
npm install recharts
```

---

## 📊 KẾT QUẢ MONG ĐỢI

### Với Admin:
- ✅ Thấy tất cả nhân viên
- ✅ Có thể thêm/sửa/xóa
- ✅ Xem được Dashboard đầy đủ

### Với Trưởng phòng:
- ✅ CHỈ thấy nhân viên của phòng mình
- ✅ Chỉ được XEM (không sửa/xóa)
- ✅ Xem được Dashboard
- ✅ Có thông báo phòng ban đang xem

### Với Nhân viên thường:
- ❌ Không vào được trang Quản lý người dùng
- ❌ Không xem được Dashboard
- ✅ Chỉ vào được tab "Học bài"

---

## 🎯 CHECKLIST HOÀN THÀNH

- [ ] Fix code trong UserManagement.tsx
- [ ] Fix code trong DashboardSimple.tsx
- [ ] Kiểm tra Firestore có đủ dữ liệu
- [ ] Test với tài khoản Admin
- [ ] Test với tài khoản Trưởng phòng
- [ ] Test với tài khoản Nhân viên
- [ ] Xác nhận sơ đồ mới hiển thị đúng
- [ ] Xác nhận logic lọc hoạt động
- [ ] Xác nhận quyền Dashboard hoạt động

---

**Ngày cập nhật:** 2024-11-27
**Trạng thái:** Đã fix, chờ test
