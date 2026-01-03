# Hướng dẫn Khắc phục Lỗi

## Lỗi: Unsupported field value: undefined

### Nguyên nhân:
Firestore không chấp nhận giá trị `undefined`. Phải dùng giá trị thực hoặc bỏ qua field đó.

### Giải pháp:
Đã được fix - chỉ thêm field vào document nếu có giá trị:
```typescript
// ❌ SAI
const data = {
  name: "Test",
  departmentId: formData.departmentId || undefined  // Lỗi!
};

// ✅ ĐÚNG
const data: any = {
  name: "Test"
};
if (formData.departmentId) {
  data.departmentId = formData.departmentId;
}
```

---

## Lỗi: No document to update

### Nguyên nhân:
- Document ID không khớp với `uid` field
- Sử dụng `addDoc()` tạo ID tự động, nhưng update bằng `uid`

### Giải pháp:
Đã được fix:
1. **Thêm user mới**: Dùng `setDoc()` với custom ID thay vì `addDoc()`
2. **Update user**: Query để tìm document ID thực từ `uid` field
3. **Delete user**: Query để tìm document ID trước khi xóa

```typescript
// ✅ Thêm mới
const userId = `user_${Date.now()}`;
await setDoc(doc(db, 'users', userId), { uid: userId, ...data });

// ✅ Update
const q = query(collection(db, 'users'), where('uid', '==', user.uid));
const snapshot = await getDocs(q);
const docId = snapshot.docs[0].id;
await updateDoc(doc(db, 'users', docId), updateData);
```

---

## Lỗi: Missing or insufficient permissions

### Nguyên nhân:
Firestore rules chưa cho phép truy cập vào collections mới (departments, salaryRecords)

### Giải pháp:

#### Cách 1: Deploy qua Firebase CLI (Đã thực hiện)
```bash
firebase deploy --only firestore:rules
```

#### Cách 2: Cập nhật trực tiếp trên Firebase Console
1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project: **classroom-257dc**
3. Vào **Firestore Database** → **Rules**
4. Thêm rules cho collections mới:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... các rules cũ
    
    // Collection departments - Quản lý phòng ban
    match /departments/{departmentId} {
      allow read, write: if true;
    }
    
    // Collection salaryRecords - Quản lý lương
    match /salaryRecords/{recordId} {
      allow read, write: if true;
    }
  }
}
```

5. Click **Publish**

### Kiểm tra sau khi deploy:
1. Refresh lại trang web (Ctrl + F5)
2. Kiểm tra xem lỗi còn xuất hiện không
3. Thử thêm phòng ban hoặc người dùng mới

---

## Lỗi: ERR_QUIC_PROTOCOL_ERROR

### Nguyên nhân:
Lỗi kết nối mạng tạm thời với Firestore

### Giải pháp:
1. **Refresh trang** (F5 hoặc Ctrl + F5)
2. **Kiểm tra kết nối internet**
3. **Xóa cache trình duyệt**:
   - Chrome: Ctrl + Shift + Delete
   - Chọn "Cached images and files"
   - Clear data
4. **Thử trình duyệt khác** (nếu vẫn lỗi)
5. **Đợi vài phút** rồi thử lại (có thể do Firebase đang bảo trì)

---

## Lỗi: Cannot find module

### Nguyên nhân:
Thiếu dependencies hoặc import sai đường dẫn

### Giải pháp:
```bash
npm install
# hoặc
npm ci
```

---

## Lỗi: Video không phát trong CourseCard

### Nguyên nhân:
- Chưa có demoVideoId
- Video chưa được xử lý xong trên Bunny
- Trình duyệt chặn autoplay

### Giải pháp:
1. Đảm bảo đã upload video demo cho khóa học
2. Đợi vài phút để Bunny xử lý video
3. Video sẽ tự động phát khi hover (muted)
4. Nếu không phát, kiểm tra console log

---

## Lỗi: Không thể upload ảnh/video

### Nguyên nhân:
- Thiếu environment variables
- File quá lớn
- Sai API key

### Giải pháp:
1. Kiểm tra file `.env.local`:
```env
# Bunny Storage (cho ảnh)
NEXT_PUBLIC_BUNNY_STORAGE_ZONE=your-storage-zone
NEXT_PUBLIC_BUNNY_STORAGE_PASSWORD=your-password
NEXT_PUBLIC_BUNNY_STORAGE_HOSTNAME=storage.bunnycdn.com
NEXT_PUBLIC_BUNNY_STORAGE_CDN_URL=your-cdn-url.b-cdn.net

# Bunny Stream (cho video)
NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID=your-library-id
NEXT_PUBLIC_BUNNY_STREAM_API_KEY=your-api-key
NEXT_PUBLIC_BUNNY_STREAM_CDN_HOSTNAME=your-cdn-hostname.b-cdn.net
```

2. Kiểm tra kích thước file:
   - Ảnh: Max 5MB
   - Video: Max 500MB

3. Restart dev server sau khi thay đổi .env:
```bash
npm run dev
```

---

## Lỗi: Lương tính sai

### Kiểm tra:
1. Lương tháng đã được nhập chưa?
2. Số ngày nghỉ/đi muộn có hợp lệ không? (0-26)
3. Công thức:
   - Lương ngày = Lương tháng / 26
   - Trừ nghỉ = Lương ngày × Số ngày nghỉ
   - Trừ đi muộn = (Lương ngày / 2) × Số ngày đi muộn

---

## Lỗi: Không thấy phòng ban trong dropdown

### Nguyên nhân:
Chưa tạo phòng ban

### Giải pháp:
1. Vào "Quản lý phòng ban"
2. Tạo ít nhất 1 phòng ban
3. Quay lại "Quản lý người dùng"
4. Dropdown sẽ hiển thị các phòng ban

---

## Lỗi: Sidebar admin không cố định

### Giải pháp:
Đã được fix với `position: fixed` và margin-left cho main content

---

## Cần hỗ trợ thêm?

1. Kiểm tra console log (F12 → Console)
2. Kiểm tra Network tab (F12 → Network)
3. Xem file logs của Firebase
4. Liên hệ support

---

## Checklist sau khi deploy

- [ ] Firestore rules đã được deploy
- [ ] Environment variables đã được set
- [ ] Collections đã được tạo trên Firestore
- [ ] Test thêm/sửa/xóa phòng ban
- [ ] Test thêm/sửa người dùng với phòng ban
- [ ] Test tính lương
- [ ] Test upload ảnh/video
- [ ] Test hover card khóa học
