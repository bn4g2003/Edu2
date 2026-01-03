# Debug: Trưởng phòng không được nhận diện

## 🔍 Cách kiểm tra

### Bước 1: Kiểm tra dữ liệu User
Mở Console (F12) và chạy:

```javascript
// Lấy tất cả users
const usersRef = collection(db, 'users');
const snapshot = await getDocs(usersRef);
snapshot.docs.forEach(doc => {
  const data = doc.data();
  console.log({
    uid: data.uid,
    name: data.displayName,
    role: data.role,           // ← Vai trò (admin, staff, teacher, student)
    position: data.position,   // ← Chức vụ (Trưởng phòng, Nhân viên, etc.)
    departmentId: data.departmentId,
    approved: data.approved
  });
});
```

**Kiểm tra:**
- ✅ `position` phải là **"Trưởng phòng"** (chính xác, có dấu)
- ✅ `departmentId` phải có giá trị (ví dụ: "dept_123")
- ✅ `approved` phải là `true` (hoặc `role` là "admin")

### Bước 2: Test tự động lấy trưởng phòng

1. Vào "Quản lý phòng ban"
2. Click nút **"Cập nhật trưởng phòng"**
3. Xem Console logs:

```
🔍 Phòng dept_123: {
  totalUsers: 3,
  users: [
    { name: "Nguyễn Văn A", position: "Trưởng phòng", approved: true },
    { name: "Trần Thị B", position: "Nhân viên", approved: true },
    { name: "Lê Văn C", position: "Nhân viên", approved: true }
  ]
}
✅ Tìm thấy trưởng phòng: Nguyễn Văn A
```

### Bước 3: Kiểm tra trong Firestore

Vào Firestore Console:

**Collection: users**
```javascript
{
  uid: "user_001",
  displayName: "Nguyễn Văn A",
  email: "a@company.com",
  role: "staff",              // ← Vai trò
  position: "Trưởng phòng",   // ← Chức vụ (QUAN TRỌNG!)
  departmentId: "dept_123",   // ← Phòng ban
  approved: true              // ← Đã duyệt
}
```

**Collection: departments**
```javascript
{
  id: "dept_123",
  name: "Phòng IT",
  managerId: "user_001",      // ← Tự động cập nhật
  managerName: "Nguyễn Văn A" // ← Tự động cập nhật
}
```

## 🐛 Các vấn đề thường gặp

### Vấn đề 1: Không tìm thấy trưởng phòng

**Console log:**
```
⚠️ Không tìm thấy trưởng phòng cho phòng dept_123
```

**Nguyên nhân:**
- ❌ `position` không phải "Trưởng phòng" (có thể là "Truong phong", "trưởng phòng", etc.)
- ❌ `departmentId` không khớp
- ❌ `approved` không phải `true`

**Giải pháp:**
1. Vào "Quản lý người dùng"
2. Tìm nhân viên cần làm trưởng phòng
3. Click "Sửa"
4. Chọn **Chức vụ**: "Trưởng phòng" (từ dropdown)
5. Chọn **Phòng ban**: Phòng cần gán
6. Lưu
7. Vào "Quản lý phòng ban" → Click "Cập nhật trưởng phòng"

### Vấn đề 2: Có nhiều người cùng chức vụ "Trưởng phòng"

**Hành vi:**
- Hệ thống chọn người đầu tiên tìm thấy
- Không có cảnh báo

**Giải pháp:**
- Chỉ nên có 1 người có chức vụ "Trưởng phòng" trong mỗi phòng ban
- Người khác nên đổi sang "Phó phòng" hoặc "Nhân viên"

### Vấn đề 3: Trưởng phòng không thấy quyền quản lý

**Kiểm tra:**
```javascript
// Trong Console, khi đã đăng nhập
console.log({
  role: currentUser.role,           // Phải khác 'admin'
  position: currentUser.position,   // Phải là 'Trưởng phòng'
  departmentId: currentUser.departmentId // Phải có giá trị
});
```

**Nếu đúng nhưng vẫn không hoạt động:**
- Đăng xuất và đăng nhập lại
- Clear cache trình duyệt (Ctrl + Shift + Delete)

### Vấn đề 4: Tag "Quản lý" không hiển thị

**Kiểm tra trong bảng Quản lý người dùng:**
- Tag chỉ hiển thị khi:
  - `position === 'Trưởng phòng'`
  - `departmentId` có giá trị

**Nếu không thấy:**
- Kiểm tra lại dữ liệu user trong Firestore
- Refresh trang

## ✅ Checklist kiểm tra đầy đủ

### Dữ liệu User:
- [ ] `position` = "Trưởng phòng" (chính xác, có dấu)
- [ ] `departmentId` có giá trị (ví dụ: "dept_123")
- [ ] `approved` = `true`
- [ ] `role` khác "admin" (thường là "staff")

### Dữ liệu Department:
- [ ] `managerId` được cập nhật (sau khi click "Cập nhật trưởng phòng")
- [ ] `managerName` được cập nhật

### Giao diện:
- [ ] Tag "Quản lý" hiển thị cạnh chức vụ trong bảng
- [ ] Tag "Quản lý phòng ban" hiển thị trong modal chi tiết
- [ ] Badge trưởng phòng hiển thị trong card phòng ban

### Quyền:
- [ ] Trưởng phòng chỉ thấy nhân viên phòng mình
- [ ] Trưởng phòng chỉ thấy khóa học phòng mình + khóa chung
- [ ] Thông báo màu xanh hiển thị tên phòng ban

## 🔧 Script sửa nhanh

Nếu cần sửa thủ công trong Console:

```javascript
// 1. Tìm user cần làm trưởng phòng
const usersRef = collection(db, 'users');
const q = query(usersRef, where('email', '==', 'a@company.com'));
const snapshot = await getDocs(q);
const userDoc = snapshot.docs[0];

// 2. Cập nhật position và departmentId
await updateDoc(doc(db, 'users', userDoc.id), {
  position: 'Trưởng phòng',
  departmentId: 'dept_123',
  approved: true
});

// 3. Cập nhật department
await updateDoc(doc(db, 'departments', 'dept_123'), {
  managerId: userDoc.data().uid,
  managerName: userDoc.data().displayName
});

console.log('✅ Đã cập nhật!');
```

## 📸 Screenshots mẫu

### Trong Quản lý người dùng:
```
| Tên          | Chức vụ                    |
|--------------|----------------------------|
| Nguyễn Văn A | [Trưởng phòng] [Quản lý]  | ← Tag xanh dương
| Trần Thị B   | [Nhân viên]                |
```

### Trong Quản lý phòng ban:
```
┌─────────────────────────────┐
│ Phòng IT                    │
│ Mô tả phòng ban...          │
│ 👤 Trưởng phòng: [👥 Nguyễn Văn A] │ ← Badge xanh dương
│ 5 nhân viên                 │
└─────────────────────────────┘
```

### Khi đăng nhập với tài khoản Trưởng phòng:
```
Quản lý người dùng
🏢 Bạn đang xem nhân viên của phòng ban: Phòng IT
```

## 📞 Nếu vẫn không hoạt động

Gửi cho tôi:
1. Screenshot Console logs khi click "Cập nhật trưởng phòng"
2. Screenshot dữ liệu user trong Firestore
3. Screenshot dữ liệu department trong Firestore
4. Mô tả chi tiết vấn đề
