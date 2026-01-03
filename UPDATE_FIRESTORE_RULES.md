# Cập nhật Firestore Rules

## ⚠️ Lỗi hiện tại:
```
FirebaseError: Missing or insufficient permissions
```

## ✅ Đã sửa:
Thêm rule cho collection `lessonProgress` vào file `firestore.rules`

## 🚀 Deploy lên Firebase:

### Cách 1: Sử dụng Firebase CLI (Khuyến nghị)
```bash
# Deploy rules
firebase deploy --only firestore:rules
```

### Cách 2: Thủ công qua Firebase Console
1. Mở https://console.firebase.google.com
2. Chọn project của bạn
3. Vào **Firestore Database** → **Rules**
4. Copy nội dung từ file `firestore.rules`
5. Paste vào editor
6. Click **Publish**

## 📋 Rule đã thêm:
```javascript
// Collection lessonProgress - Tiến độ học bài
match /lessonProgress/{progressId} {
  allow read, write: if true;
}
```

## ✅ Sau khi deploy:
1. Refresh trang web
2. Click "Cập nhật giờ học"
3. Kiểm tra console - không còn lỗi permission
4. Thời gian học sẽ hiển thị đúng

## 🔒 Lưu ý bảo mật:
Hiện tại đang dùng `if true` cho development. 
Trong production nên thay bằng:
```javascript
match /lessonProgress/{progressId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null && 
               request.auth.uid == resource.data.userId;
}
```
