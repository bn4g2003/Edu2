# ✨ TÍNH NĂNG MỚI: Banner Khóa Học & Tài Liệu Kiểm Tra

## 📋 Tóm tắt thay đổi

### 1. ✅ Thêm trường `banner` cho khóa học
**File:** `types/course.ts`

```typescript
export interface Course {
  // ... các trường khác
  banner?: string; // Banner ảnh hiển thị ở đầu trang chi tiết khóa học
}
```

### 2. ✅ Upload banner trong quản lý khóa học
**File:** `components/admin/CourseManagement.tsx`

- Thêm field `banner` vào form
- Sử dụng `BunnyImageUpload` để upload ảnh banner
- Lưu URL banner vào Firestore

**Vị trí trong form:**
```
Thumbnail → Banner → Video Demo
```

### 3. ✅ Hiển thị banner trong trang chi tiết khóa học
**File:** `components/student/CourseViewer.tsx`

**Vị trí hiển thị:**
1. Header (gradient) - Tên khóa học, mô tả, thông tin
2. **Banner ảnh** - Full width, ngay sau header
3. Nội dung khóa học

**Banner ảnh:**
- Chiều cao responsive: 192px (mobile) → 256px (tablet) → 320px (desktop)
- Full width (100% chiều ngang)
- Object-fit: cover (giữ tỷ lệ, cắt phần thừa)
- Chỉ hiển thị khi có `course.banner`

### 4. ✅ Thêm tài liệu đính kèm cho bài kiểm tra
**File:** `types/lesson.ts`

```typescript
export interface Lesson {
  // ... các trường khác
  quizDocumentUrl?: string; // Tài liệu đính kèm cho bài kiểm tra
  quizDocumentName?: string; // Tên file tài liệu kiểm tra
}
```

**Mục đích:**
- Giáo viên có thể đính kèm tài liệu tham khảo cho bài kiểm tra
- Học viên có thể tải xuống trước khi làm bài

### 5. ⏳ Tinh chỉnh giao diện danh sách bài học (Đã có sẵn)

**Giao diện hiện tại đã tối ưu:**
- ✅ Hiển thị số thứ tự bài học
- ✅ Progress bar cho mỗi bài học
- ✅ Icon phân biệt: Video, Tài liệu, Bài kiểm tra
- ✅ Checkmark cho bài học đã hoàn thành
- ✅ Sticky sidebar (luôn hiển thị khi scroll)
- ✅ Highlight bài học đang xem
- ✅ Disable bài học chưa có nội dung

---

## 🎨 Hướng dẫn sử dụng

### Thêm banner cho khóa học:

1. Vào **Quản lý khóa học**
2. Click **Thêm khóa học** hoặc **Chỉnh sửa** khóa học có sẵn
3. Cuộn xuống phần **Banner (Ảnh bìa khóa học)**
4. Click **Chọn ảnh** và upload ảnh banner

**📐 Kích cỡ ảnh khuyến nghị:**
- **Tối ưu:** 1920x600px (tỷ lệ 16:5) - Phù hợp với banner ngang
- **Thay thế:** 1920x1080px (tỷ lệ 16:9) - Phù hợp với ảnh phong cảnh
- **Tối thiểu:** 1280x400px
- **Kích thước file:** Tối đa 5MB
- **Định dạng:** JPG (khuyến nghị), PNG, WebP

**💡 Mẹo:**
- Sử dụng ảnh có độ phân giải cao để hiển thị sắc nét
- Tránh ảnh có text nhỏ (sẽ khó đọc trên mobile)
- Nên dùng ảnh ngang (landscape) thay vì dọc (portrait)
- Có thể dùng Canva để tạo banner với template 1920x600px

5. Click **Lưu**

### Thêm tài liệu cho bài kiểm tra:

**Lưu ý:** Tính năng này cần được implement trong `LessonManagement.tsx`

**Các bước cần làm:**
1. Mở file `components/admin/LessonManagement.tsx` (hoặc tương tự)
2. Thêm field upload tài liệu cho quiz:
   ```typescript
   <BunnyFileUpload
     label="Tài liệu đính kèm cho bài kiểm tra"
     currentFile={formData.quizDocumentUrl}
     currentFileName={formData.quizDocumentName}
     onUploadComplete={(url, fileName) => {
       setFormData({ 
         ...formData, 
         quizDocumentUrl: url,
         quizDocumentName: fileName
       });
     }}
     folder="lessons/quiz-documents"
   />
   ```
3. Hiển thị link tải tài liệu trong `QuizTaker.tsx`:
   ```typescript
   {lesson.quizDocumentUrl && (
     <div className="mb-4 p-4 bg-blue-50 rounded-lg">
       <p className="text-sm text-blue-900 mb-2">
         📎 Tài liệu tham khảo cho bài kiểm tra
       </p>
       <a
         href={lesson.quizDocumentUrl}
         target="_blank"
         rel="noopener noreferrer"
         className="text-blue-600 hover:text-blue-700 underline"
       >
         {lesson.quizDocumentName || 'Tải xuống tài liệu'}
       </a>
     </div>
   )}
   ```

---

## 📸 Preview

### Layout trang chi tiết khóa học:
```
┌─────────────────────────────────────────┐
│ [Header - Gradient]                     │
│  ← Quay lại                             │
│  Tên khóa học                           │
│  Mô tả khóa học                         │
│  ⏱ 10 giờ • Giảng viên • Cơ bản        │
├─────────────────────────────────────────┤
│                                         │
│      [Banner ảnh - Full width]          │
│         (1920x600px)                    │
│                                         │
├─────────────────────────────────────────┤
│ [Nội dung khóa học]                     │
│ Video / Tài liệu / Bài kiểm tra         │
└─────────────────────────────────────────┘
```

### Danh sách bài học (đã tối ưu):
```
┌─────────────────────────────┐
│ Nội dung khóa học           │
│ 10 bài học                  │
├─────────────────────────────┤
│ [1] Bài 1: Giới thiệu      │
│     ▓▓▓▓▓▓▓▓░░░░ 80%       │
│     🎥 Video 📄 Tài liệu    │
├─────────────────────────────┤
│ [2] Bài 2: Cơ bản          │
│     ▓▓▓▓▓▓▓▓▓▓▓▓ 100% ✓    │
│     🎥 Video ❓ Kiểm tra    │
└─────────────────────────────┘
```

---

## 🔧 Files đã thay đổi

1. ✅ `types/course.ts` - Thêm field `banner`
2. ✅ `types/lesson.ts` - Thêm `quizDocumentUrl` và `quizDocumentName`
3. ✅ `components/admin/CourseManagement.tsx` - Upload banner
4. ✅ `components/student/CourseViewer.tsx` - Hiển thị banner

## 📝 TODO

- [ ] Implement upload tài liệu quiz trong `LessonManagement.tsx`
- [ ] Hiển thị link tải tài liệu trong `QuizTaker.tsx`
- [ ] Test upload và hiển thị banner
- [ ] Optimize ảnh banner (compression, lazy loading)

---

**Ngày tạo:** 2024-11-27
**Trạng thái:** ✅ Banner hoàn thành, ⏳ Tài liệu quiz cần implement
