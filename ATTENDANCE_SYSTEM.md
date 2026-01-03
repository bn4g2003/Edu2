# Hệ thống Quản lý Chấm công

## Tổng quan

Hệ thống chấm công tự động với kiểm tra IP công ty và tính lương dựa trên số ngày công thực tế.

## Tính năng chính

### 1. Cài đặt công ty (Admin)

Admin có thể cấu hình:
- **Địa chỉ IP công ty**: Danh sách IP công cộng được phép check-in/check-out
  - Thêm thủ công từng IP
  - Tự động lấy IP hiện tại của WiFi đang dùng
- **Giờ làm việc**: 
  - Giờ bắt đầu (mặc định: 08:00)
  - Giờ kết thúc (mặc định: 17:00)
- **Ngưỡng đi muộn**: Số phút được phép đi muộn (mặc định: 15 phút)
- **Số ngày công**: Số ngày công chuẩn mỗi tháng (mặc định: 26 ngày)

### 2. Chấm công nhân viên (Staff)

Giao diện mặc định khi staff đăng nhập:

#### Check-in
- Hiển thị thời gian thực
- Kiểm tra IP công ty tự động
- Chỉ cho phép check-in khi đang ở trong mạng công ty
- Tự động xác định trạng thái:
  - **Đúng giờ**: Check-in trong khoảng thời gian cho phép
  - **Đi muộn**: Check-in sau ngưỡng cho phép (ghi nhận số phút muộn)

#### Check-out
- Tự động tính số giờ làm việc
- So sánh với khung giờ làm việc để xác định:
  - **Nửa ngày**: Làm việc dưới 4 giờ
  - **Đủ ngày**: Làm việc từ 4 giờ trở lên

#### Thông tin hiển thị
- Thời gian hiện tại (cập nhật mỗi giây)
- Trạng thái kết nối mạng công ty
- IP hiện tại
- Giờ làm việc của công ty
- Lịch sử chấm công trong ngày

### 3. Quản lý chấm công (Admin)

Admin có thể:
- Xem tổng quan chấm công theo tháng
- Theo dõi từng nhân viên:
  - Số ngày đi làm đúng giờ
  - Số ngày đi muộn
  - Số ngày làm nửa ngày
  - Số ngày nghỉ (tự động tính)
- Tính lương tự động dựa trên:
  - Lương cơ bản (từ thông tin user)
  - Số ngày công chuẩn (26 ngày)
  - Số ngày thực tế đi làm
  - Công thức tính:
    ```
    Lương ngày = Lương tháng / 26
    Trừ nghỉ = Lương ngày × Số ngày nghỉ
    Trừ muộn = (Lương ngày × 0.5) × Số ngày đi muộn
    Trừ nửa ngày = (Lương ngày × 0.5) × Số ngày nửa ngày
    Lương thực nhận = Lương tháng - Tổng trừ
    ```

## Cấu trúc dữ liệu

### CompanySettings
```typescript
{
  id: string;
  allowedIPs: string[];
  workStartTime: string; // "HH:mm"
  workEndTime: string; // "HH:mm"
  lateThresholdMinutes: number;
  workingDaysPerMonth: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### AttendanceRecord
```typescript
{
  id: string;
  userId: string;
  userName: string;
  date: string; // "YYYY-MM-DD"
  checkInTime: Date;
  checkInIP: string;
  checkOutTime?: Date;
  checkOutIP?: string;
  status: 'present' | 'late' | 'absent' | 'half-day';
  lateMinutes?: number;
  workHours?: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### MonthlySalary
```typescript
{
  id: string;
  userId: string;
  userName: string;
  departmentId?: string;
  month: string; // "YYYY-MM"
  baseSalary: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  totalDeduction: number;
  finalSalary: number;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Firestore Collections

1. **companySettings**: Cài đặt công ty (1 document)
2. **attendanceRecords**: Bản ghi chấm công hàng ngày
3. **monthlySalaries**: Bảng lương tháng đã tính

## Quy trình sử dụng

### Lần đầu thiết lập
1. Admin vào "Quản lý chấm công"
2. Click "Cài đặt"
3. Thêm IP công ty (có thể dùng nút "Thêm IP này" để lấy IP hiện tại)
4. Cấu hình giờ làm việc và các thông số khác
5. Lưu cài đặt

### Hàng ngày
1. Nhân viên đăng nhập vào hệ thống
2. Giao diện chấm công hiển thị tự động
3. Check-in khi đến công ty (phải kết nối WiFi công ty)
4. Check-out khi về (phải kết nối WiFi công ty)

### Cuối tháng
1. Admin vào "Quản lý chấm công"
2. Chọn tháng cần tính lương
3. Xem thống kê chấm công của từng nhân viên
4. Click "Tính lương" để tự động tính và lưu bảng lương
5. Có thể "Cập nhật" nếu cần tính lại

## Lưu ý

- Nhân viên phải có `monthlySalary` trong profile để tính lương
- IP công ty cần là IP công cộng (public IP), không phải IP nội bộ
- Hệ thống sử dụng API https://api.ipify.org để lấy IP công cộng
- Chỉ cho phép check-in/check-out 1 lần mỗi ngày
- Trạng thái "absent" được tính tự động dựa trên số ngày không có bản ghi chấm công

## Quyền truy cập

- **Admin**: Toàn quyền quản lý chấm công và tính lương
- **Staff**: Chỉ được check-in/check-out cho bản thân
- Quyền `view_salary` được sử dụng để kiểm soát truy cập trang quản lý chấm công
