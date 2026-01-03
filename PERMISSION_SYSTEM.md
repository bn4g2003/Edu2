# Hệ thống Phân quyền Động

## Tổng quan
Hệ thống phân quyền linh hoạt theo phòng ban và vai trò, cho phép kiểm soát truy cập chi tiết đến từng tính năng.

---

## ⭐ Phân quyền theo Phòng ban

### Cách hoạt động:
1. **Admin** vào "Quản lý phòng ban"
2. Click icon **Shield** (🛡️) trên card phòng ban
3. Chọn các quyền muốn cấp cho phòng ban đó
4. Lưu lại

### Quyền được áp dụng:
- **Trưởng phòng**: Quyền phòng ban + Quyền manager mặc định
- **Nhân viên**: Chỉ có quyền của phòng ban

### Ví dụ:
**Phòng Kỹ thuật** được cấp quyền:
- view_courses
- manage_courses
- view_users

→ Tất cả nhân viên phòng Kỹ thuật sẽ có 3 quyền này
→ Trưởng phòng Kỹ thuật có thêm quyền: view_dashboard, manage_own_department, view_salary

---

## Cấu trúc Quyền

### Các loại quyền (PermissionAction):
1. **view_dashboard** - Xem trang tổng quan
2. **view_users** - Xem danh sách người dùng
3. **manage_users** - Quản lý người dùng (thêm/sửa/xóa)
4. **view_courses** - Xem danh sách khóa học
5. **manage_courses** - Quản lý khóa học
6. **view_departments** - Xem danh sách phòng ban
7. **manage_departments** - Quản lý phòng ban
8. **view_salary** - Xem bảng lương
9. **manage_salary** - Quản lý lương
10. **view_own_department** - Xem phòng ban của mình
11. **manage_own_department** - Quản lý phòng ban của mình

---

## Vai trò Mặc định

### 1. Admin
**Quyền:**
- Tất cả quyền trong hệ thống
- Không bị giới hạn bởi phòng ban

### 2. Trưởng phòng (Manager)
**Điều kiện:** User có `departmentId` và là `managerId` của phòng ban đó

**Quyền:**
- view_dashboard
- view_users
- view_courses
- view_own_department
- manage_own_department
- view_salary

### 3. Nhân viên (Staff)
**Điều kiện:** User có role = 'staff'

**Quyền:**
- view_dashboard
- view_courses
- view_own_department

---

## Cách sử dụng

### 1. Trong Component

```typescript
import { usePermissions } from '@/contexts/PermissionContext';

function MyComponent() {
  const { hasPermission, hasAnyPermission } = usePermissions();

  // Check single permission
  if (hasPermission('manage_users')) {
    // Show edit button
  }

  // Check multiple permissions (OR)
  if (hasAnyPermission(['view_users', 'manage_users'])) {
    // Show users page
  }

  return <div>...</div>;
}
```

### 2. Với ProtectedRoute

```typescript
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

// Single permission
<ProtectedRoute requiredPermission="view_users">
  <UserManagement />
</ProtectedRoute>

// Multiple permissions (OR - chỉ cần 1)
<ProtectedRoute 
  requiredPermissions={['view_users', 'manage_users']}
  requireAll={false}
>
  <UserManagement />
</ProtectedRoute>

// Multiple permissions (AND - cần tất cả)
<ProtectedRoute 
  requiredPermissions={['view_users', 'manage_users']}
  requireAll={true}
>
  <UserManagement />
</ProtectedRoute>

// Custom fallback
<ProtectedRoute 
  requiredPermission="manage_users"
  fallback={<div>Bạn không có quyền</div>}
>
  <UserManagement />
</ProtectedRoute>
```

### 3. Trong Menu/Navigation

```typescript
const menuItems = [
  { 
    id: 'users', 
    label: 'Quản lý người dùng',
    permission: 'view_users' as const
  }
];

// Chỉ hiển thị menu nếu có quyền
{menuItems.map(item => {
  if (!hasPermission(item.permission)) return null;
  return <MenuItem key={item.id} {...item} />;
})}
```

---

## Luồng hoạt động

### 1. User đăng nhập
```
User login → AuthContext lưu userProfile
```

### 2. Load permissions
```
PermissionProvider → Check userProfile
  ├─ Admin? → Tất cả quyền
  ├─ Manager? → Quyền trưởng phòng
  ├─ Staff? → Quyền nhân viên
  └─ Default → Không có quyền
```

### 3. Check quyền khi render
```
Component render → usePermissions()
  → hasPermission(action)
    → true: Hiển thị
    → false: Ẩn hoặc show fallback
```

---

## API Reference

### usePermissions Hook

```typescript
const {
  permissions,           // Array<PermissionAction>
  hasPermission,        // (action: PermissionAction) => boolean
  hasAnyPermission,     // (actions: PermissionAction[]) => boolean
  hasAllPermissions,    // (actions: PermissionAction[]) => boolean
  loading              // boolean
} = usePermissions();
```

### ProtectedRoute Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionAction;      // Single permission
  requiredPermissions?: PermissionAction[];   // Multiple permissions
  requireAll?: boolean;                       // true = AND, false = OR
  fallback?: React.ReactNode;                // Custom fallback UI
}
```

---

## Ví dụ thực tế

### 1. Ẩn nút Edit nếu không có quyền

```typescript
function UserList() {
  const { hasPermission } = usePermissions();

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          <span>{user.name}</span>
          {hasPermission('manage_users') && (
            <button onClick={() => editUser(user)}>Edit</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 2. Redirect nếu không có quyền

```typescript
function AdminPage() {
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!hasPermission('view_dashboard')) {
      router.push('/unauthorized');
    }
  }, [hasPermission]);

  return <Dashboard />;
}
```

### 3. Conditional rendering

```typescript
function Sidebar() {
  const { hasPermission } = usePermissions();

  return (
    <nav>
      {hasPermission('view_dashboard') && <Link href="/dashboard">Dashboard</Link>}
      {hasPermission('view_users') && <Link href="/users">Users</Link>}
      {hasPermission('view_salary') && <Link href="/salary">Salary</Link>}
    </nav>
  );
}
```

---

## Mở rộng trong tương lai

### 1. Custom Roles
Thêm collection `roles` trong Firestore:
```typescript
{
  id: "role_123",
  name: "Kế toán",
  permissions: ["view_salary", "manage_salary"],
  departmentId: "dept_456"
}
```

### 2. User-specific permissions
Thêm field `customPermissions` vào User:
```typescript
{
  uid: "user_123",
  role: "staff",
  customPermissions: ["manage_courses"] // Quyền đặc biệt
}
```

### 3. Time-based permissions
```typescript
{
  permission: "manage_salary",
  validFrom: "2024-01-01",
  validTo: "2024-12-31"
}
```

### 4. Resource-level permissions
```typescript
{
  permission: "edit_course",
  resourceId: "course_123" // Chỉ edit được khóa học này
}
```

---

## Troubleshooting

### Lỗi: "usePermissions must be used within a PermissionProvider"
**Giải pháp:** Wrap component với PermissionProvider
```typescript
<PermissionProvider>
  <YourComponent />
</PermissionProvider>
```

### Menu không hiển thị
**Kiểm tra:**
1. User đã đăng nhập chưa?
2. User có quyền tương ứng chưa?
3. PermissionProvider đã được wrap chưa?

### Permission không update
**Giải pháp:** 
- Logout và login lại
- Clear cache
- Check console log xem permissions có load đúng không

---

## Security Notes

⚠️ **Quan trọng:**
- Frontend permissions chỉ để UX, không phải security
- Backend/Firestore rules phải validate lại permissions
- Không tin tưởng client-side checks hoàn toàn
- Luôn validate ở server/Firestore rules

### Firestore Rules Example:
```javascript
match /users/{userId} {
  allow read: if request.auth != null;
  allow write: if request.auth.token.role == 'admin';
}
```
