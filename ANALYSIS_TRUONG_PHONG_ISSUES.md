# 📊 PHÂN TÍCH VẤN ĐỀ TRƯỞNG PHÒNG

## 🔍 TÓM TẮT CÁC VẤN ĐỀ

### 1. ❌ Logic lọc nhân viên theo phòng ban KHÔNG HOẠT ĐỘNG
**File:** `components/admin/UserManagement.tsx` (dòng 145-150)

**Vấn đề:**
```typescript
const isManager = departments.some(d => d.managerId === currentUser?.uid);

if (isManager && currentUser?.departmentId) {
  filtered = filtered.filter(user => user.departmentId === currentUser.departmentId);
}
```

**Nguyên nhân:**
- Logic kiểm tra `isManager` dựa vào `departments.managerId`
- Nhưng `departments` được load từ Firestore chỉ có `id` và `name` (dòng 127-131)
- **KHÔNG BAO GỒM** field `managerId` và `managerName`!

```typescript
// Dòng 127-131 - Chỉ load id và name
const deptSnapshot = await getDocs(collection(db, 'departments'));
const depts = deptSnapshot.docs.map(doc => ({
  id: doc.id,
  name: doc.data().name
}));
```

**Kết quả:** `isManager` luôn là `false` → Logic lọc không bao giờ chạy!

---

### 2. ❌ Trưởng phòng KHÔNG ĐƯỢC XEM DASHBOARD
**File:** `contexts/PermissionContext.tsx` (dòng 40-52)

**Vấn đề:**
```typescript
// Check if user is department manager
if (deptData.managerId === userProfile.uid) {
  // Manager: Kết hợp quyền phòng ban + quyền manager mặc định
  const managerPerms = [...new Set([...deptPermissions, ...DEFAULT_ROLES.MANAGER.permissions])];
  setPermissions(managerPerms);
  return;
}
```

**Nguyên nhân:**
- Logic phân quyền dựa vào `deptData.managerId` từ Firestore
- Nhưng khi tạo/sửa department trong `DepartmentManagement.tsx`, field `managerId` được lưu
- **NHƯNG** logic này chỉ hoạt động nếu department đã có `managerId` trong database
- Nếu department chưa có manager hoặc manager chưa được set đúng → Không có quyền `view_dashboard`

**Quyền mặc định của MANAGER:**
```typescript
MANAGER: {
  name: 'Trưởng phòng',
  permissions: [
    'view_dashboard',      // ← Cần quyền này để xem Dashboard
    'view_users',
    'view_courses',
    'view_own_department',
    'manage_own_department',
    'view_salary'
  ]
}
```

---

### 3. ⚠️ SƠ ĐỒ HIỆN TẠI CHO "SO SÁNH CHỈ SỐ HỌC TẬP THEO PHÒNG BAN"
**File:** `components/admin/DashboardSimple.tsx` (dòng 217-228)

**Hiện tại:** Sử dụng **LineChart** (biểu đồ đường)

```typescript
<LineChart data={stats.departmentComparison}>
  <Line type="monotone" dataKey="Giờ học" stroke="#3b82f6" strokeWidth={2} />
  <Line type="monotone" dataKey="Bài hoàn thành" stroke="#10b981" strokeWidth={2} />
  <Line type="monotone" dataKey="Điểm TB" stroke="#f59e0b" strokeWidth={2} />
  <Line type="monotone" dataKey="Số người" stroke="#8b5cf6" strokeWidth={2} />
</LineChart>
```

**Vấn đề:**
- LineChart phù hợp cho dữ liệu **theo thời gian** (time series)
- Nhưng dữ liệu này là **so sánh giữa các phòng ban** (categorical data)
- Các chỉ số có đơn vị khác nhau: giờ, số lượng, điểm → Khó so sánh trên cùng 1 trục Y

---

## ✅ GIẢI PHÁP

### 1. FIX: Load đầy đủ thông tin departments
**File:** `components/admin/UserManagement.tsx`

**Thay đổi dòng 127-131:**
```typescript
// ❌ CŨ - Chỉ load id và name
const deptSnapshot = await getDocs(collection(db, 'departments'));
const depts = deptSnapshot.docs.map(doc => ({
  id: doc.id,
  name: doc.data().name
}));

// ✅ MỚI - Load đầy đủ thông tin
const deptSnapshot = await getDocs(collection(db, 'departments'));
const depts = deptSnapshot.docs.map(doc => ({
  id: doc.id,
  name: doc.data().name,
  managerId: doc.data().managerId,
  managerName: doc.data().managerName
}));
```

---

### 2. FIX: Đảm bảo department có managerId trong database
**Kiểm tra trong Firestore:**

Mỗi document trong collection `departments` cần có:
```json
{
  "name": "Phòng IT",
  "description": "...",
  "managerId": "user_123456",  // ← UID của trưởng phòng
  "managerName": "Nguyễn Văn A",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cách set manager:**
1. Vào "Quản lý phòng ban"
2. Click "Chỉnh sửa" phòng ban
3. Chọn trưởng phòng từ dropdown (chỉ hiện nhân viên trong phòng)
4. Lưu lại

---

### 3. KHUYẾN NGHỊ: Thay đổi sơ đồ "So sánh chỉ số học tập"

#### 🎯 Lựa chọn tối ưu: **Grouped Bar Chart** (Biểu đồ cột nhóm)

**Lý do:**
- ✅ Dễ so sánh giữa các phòng ban
- ✅ Hiển thị nhiều chỉ số cùng lúc
- ✅ Trực quan, dễ đọc
- ✅ Phù hợp với dữ liệu categorical

**Code mẫu:**
```typescript
<ResponsiveContainer width="100%" height={350}>
  <BarChart data={stats.departmentComparison}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="Giờ học" fill="#3b82f6" />
    <Bar dataKey="Bài hoàn thành" fill="#10b981" />
    <Bar dataKey="Điểm TB" fill="#f59e0b" />
    <Bar dataKey="Số người" fill="#8b5cf6" />
  </BarChart>
</ResponsiveContainer>
```

#### 🎯 Lựa chọn thay thế 1: **Radar Chart** (Biểu đồ radar)

**Lý do:**
- ✅ Hiển thị toàn diện các chỉ số của mỗi phòng ban
- ✅ Dễ nhận biết điểm mạnh/yếu
- ⚠️ Khó so sánh khi có nhiều phòng ban (>5)

**Code mẫu:**
```typescript
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Cần normalize data về cùng scale (0-100)
const normalizedData = stats.departmentComparison.map(dept => ({
  metric: dept.name,
  'Giờ học': (dept['Giờ học'] / maxHours) * 100,
  'Bài hoàn thành': (dept['Bài hoàn thành'] / maxLessons) * 100,
  'Điểm TB': dept['Điểm TB'], // Đã là 0-100
  'Số người': (dept['Số người'] / maxUsers) * 100
}));

<RadarChart data={normalizedData}>
  <PolarGrid />
  <PolarAngleAxis dataKey="metric" />
  <PolarRadiusAxis />
  <Radar name="Phòng IT" dataKey="Phòng IT" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
  <Radar name="Phòng Marketing" dataKey="Phòng Marketing" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
</RadarChart>
```

#### 🎯 Lựa chọn thay thế 2: **Stacked Bar Chart** (Biểu đồ cột xếp chồng)

**Lý do:**
- ✅ Hiển thị tổng thể và chi tiết
- ✅ Tiết kiệm không gian
- ⚠️ Khó so sánh các chỉ số không phải ở đáy

**Code mẫu:**
```typescript
<BarChart data={stats.departmentComparison}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="Giờ học" stackId="a" fill="#3b82f6" />
  <Bar dataKey="Bài hoàn thành" stackId="a" fill="#10b981" />
  <Bar dataKey="Điểm TB" stackId="a" fill="#f59e0b" />
</BarChart>
```

---

## 🎨 KHUYẾN NGHỊ CUỐI CÙNG

### Sơ đồ tốt nhất: **Grouped Bar Chart**

**Ưu điểm:**
1. ✅ Dễ đọc và so sánh
2. ✅ Không cần normalize data
3. ✅ Phù hợp với nhiều phòng ban
4. ✅ Hỗ trợ tốt trên mobile

**Nhược điểm:**
- ⚠️ Các chỉ số có scale khác nhau → Có thể cần 2 trục Y (dual axis)

### Giải pháp nâng cao: **Dual Axis Grouped Bar Chart**

```typescript
<ResponsiveContainer width="100%" height={350}>
  <BarChart data={stats.departmentComparison}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis yAxisId="left" label={{ value: 'Giờ học / Bài hoàn thành', angle: -90, position: 'insideLeft' }} />
    <YAxis yAxisId="right" orientation="right" label={{ value: 'Điểm TB / Số người', angle: 90, position: 'insideRight' }} />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="Giờ học" fill="#3b82f6" />
    <Bar yAxisId="left" dataKey="Bài hoàn thành" fill="#10b981" />
    <Bar yAxisId="right" dataKey="Điểm TB" fill="#f59e0b" />
    <Bar yAxisId="right" dataKey="Số người" fill="#8b5cf6" />
  </BarChart>
</ResponsiveContainer>
```

---

## 📋 CHECKLIST KIỂM TRA

### Để trưởng phòng hoạt động đúng:

- [ ] **Department có managerId trong Firestore**
  ```
  departments/{deptId}
    ├─ managerId: "user_xxx"
    └─ managerName: "Tên trưởng phòng"
  ```

- [ ] **User có đúng thông tin**
  ```
  users/{userId}
    ├─ position: "Trưởng phòng"
    ├─ departmentId: "dept_xxx"
    └─ approved: true
  ```

- [ ] **Load đầy đủ department data trong UserManagement**
  - Bao gồm: id, name, managerId, managerName

- [ ] **Permission system hoạt động**
  - Manager có quyền: view_dashboard, view_users, view_courses, etc.

---

## 🚀 HÀNH ĐỘNG TIẾP THEO

1. **Fix ngay:** Load đầy đủ department data trong UserManagement.tsx
2. **Kiểm tra:** Đảm bảo departments trong Firestore có managerId
3. **Cải thiện:** Thay LineChart → Grouped Bar Chart cho dashboard
4. **Test:** Đăng nhập với tài khoản trưởng phòng và kiểm tra

---

**Ngày tạo:** 2024-11-27
**Trạng thái:** Chờ fix
