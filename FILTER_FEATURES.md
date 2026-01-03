# Tính năng Bộ lọc (Filters)

## Tổng quan
Đã thêm bộ lọc mạnh mẽ cho tất cả các trang quản lý để dễ dàng tìm kiếm và lọc dữ liệu.

---

## 1. Quản lý Phòng ban ✅

### Bộ lọc:
- **Tìm kiếm**: Theo tên phòng ban, mô tả, tên trưởng phòng
- **Thống kê**: 
  - Tổng phòng ban
  - Số phòng ban có trưởng phòng
  - Tổng nhân viên

### Cách sử dụng:
1. Nhập từ khóa vào ô tìm kiếm
2. Kết quả lọc hiển thị ngay lập tức
3. Xem thống kê tổng quan ở trên

---

## 2. Quản lý Người dùng ✅

### Bộ lọc:
- **Tìm kiếm**: Theo tên hoặc email
- **Vai trò**: 
  - Tất cả vai trò
  - Admin
  - Nhân viên
  - Giáo viên
  - Học viên
- **Phòng ban**:
  - Tất cả phòng ban
  - Chưa có phòng ban
  - Từng phòng ban cụ thể

### Thống kê:
- Tổng số người dùng
- Số Admin
- Số Nhân viên
- Số Giáo viên
- Số Học viên

### Cách sử dụng:
1. Nhập từ khóa tìm kiếm
2. Chọn vai trò cần lọc
3. Chọn phòng ban cần lọc
4. Kết quả hiển thị theo điều kiện đã chọn

---

## 3. Quản lý Khóa học ✅

### Bộ lọc:
- **Tìm kiếm**: Theo tên khóa học, danh mục, mô tả
- **Cấp độ**:
  - Tất cả cấp độ
  - Cơ bản
  - Trung cấp
  - Nâng cao
- **Danh mục**: Tự động lấy từ các khóa học hiện có

### Thống kê:
- Tổng khóa học
- Số khóa học theo cấp độ (Cơ bản, Trung cấp, Nâng cao)

### Cách sử dụng:
1. Nhập từ khóa tìm kiếm
2. Chọn cấp độ
3. Chọn danh mục
4. Kết quả lọc theo tất cả điều kiện

---

## 4. Quản lý Lương ✅

### Bộ lọc:
- **Tìm kiếm**: Theo tên nhân viên hoặc email
- **Trạng thái**:
  - Tất cả
  - Đã tính lương
  - Chưa tính lương
- **Tháng**: Chọn tháng cần xem

### Thống kê:
- Tổng nhân viên
- Số nhân viên đã tính lương
- Tổng lương cơ bản
- Tổng lương thực nhận

### Cách sử dụng:
1. Chọn tháng cần xem
2. Nhập từ khóa tìm kiếm
3. Chọn trạng thái (đã/chưa tính lương)
4. Xem danh sách và thống kê

---

## Tính năng chung

### 1. Real-time filtering
- Kết quả lọc cập nhật ngay khi thay đổi điều kiện
- Không cần nhấn nút "Tìm kiếm"

### 2. Multiple filters
- Có thể kết hợp nhiều điều kiện lọc cùng lúc
- VD: Tìm nhân viên + Phòng ban + Vai trò

### 3. Clear indication
- Hiển thị "Không tìm thấy..." khi không có kết quả
- Thống kê cập nhật theo dữ liệu thực

### 4. Responsive
- Bộ lọc hoạt động tốt trên mọi kích thước màn hình
- Dropdown và input box responsive

---

## Code Implementation

### Pattern chung:
```typescript
// 1. State cho filters
const [searchTerm, setSearchTerm] = useState('');
const [filterType, setFilterType] = useState('all');
const [filteredData, setFilteredData] = useState([]);

// 2. useEffect để lọc khi điều kiện thay đổi
useEffect(() => {
  filterData();
}, [data, searchTerm, filterType]);

// 3. Hàm lọc
const filterData = () => {
  let filtered = data;
  
  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Type filter
  if (filterType !== 'all') {
    filtered = filtered.filter(item => item.type === filterType);
  }
  
  setFilteredData(filtered);
};
```

---

## UI Components

### Search Input:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
  <input
    type="text"
    placeholder="Tìm kiếm..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
  />
</div>
```

### Select Dropdown:
```tsx
<select
  value={filterType}
  onChange={(e) => setFilterType(e.target.value)}
  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
>
  <option value="all">Tất cả</option>
  <option value="type1">Loại 1</option>
  <option value="type2">Loại 2</option>
</select>
```

---

## Performance

### Optimizations:
1. **Debouncing**: Có thể thêm debounce cho search input nếu dữ liệu lớn
2. **Memoization**: Dùng `useMemo` cho các tính toán phức tạp
3. **Lazy loading**: Load dữ liệu theo trang nếu có hàng nghìn records

### Example với debounce:
```typescript
import { useDebounce } from 'use-debounce';

const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearch] = useDebounce(searchTerm, 300);

useEffect(() => {
  filterData();
}, [data, debouncedSearch, filterType]);
```

---

## Future Enhancements

- [ ] Export dữ liệu đã lọc ra Excel/CSV
- [ ] Lưu bộ lọc yêu thích
- [ ] Advanced filters (date range, multiple select)
- [ ] Filter presets
- [ ] URL query params cho filters (shareable links)
- [ ] Filter history
