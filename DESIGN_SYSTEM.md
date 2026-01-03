# Design System - Kama Admin Panel

## 🎨 Color Palette

### Primary Colors
- **Blue**: `from-blue-500 to-blue-600` - Users, General
- **Green**: `from-green-500 to-green-600` - Success, Courses
- **Purple**: `from-purple-500 to-purple-600` - Departments, Permissions
- **Orange**: `from-orange-500 to-orange-600` - Salary, Money
- **Red**: `from-red-500 to-red-600` - Admin, Danger

### Background
- **Page**: `bg-gradient-to-br from-slate-50 to-slate-100`
- **Card**: `bg-white`
- **Hover**: `hover:bg-slate-50`

### Borders
- **Default**: `border border-slate-200`
- **Focus**: `focus:ring-2 focus:ring-blue-500`

## 📐 Layout Structure

### Page Container
```tsx
<div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
  {/* Content */}
</div>
```

### Header Section
```tsx
<PageHeader 
  title="Tên trang"
  description="Mô tả ngắn gọn"
  action={<Button>Action</Button>}
/>
```

### Stats Grid (4 columns)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <StatCard title="..." value="..." icon={Icon} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
</div>
```

### Search & Filters Bar
```tsx
<div className="flex gap-4 mb-6">
  <SearchBar value={search} onChange={setSearch} placeholder="..." />
  <select className="px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
    {/* Options */}
  </select>
</div>
```

## 🎯 Components

### Buttons
```tsx
// Primary
<Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
  Text
</Button>

// Success
<Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
  Text
</Button>

// Danger
<Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
  Text
</Button>
```

### Cards
```tsx
<div className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
  {/* Content */}
</div>
```

### Tables
```tsx
<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
  <table className="w-full">
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
          Header
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200">
      <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4">Content</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Modals
```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <div className="p-6 border-b border-slate-200 flex items-center justify-between">
      <h3 className="text-xl font-bold text-slate-900">Title</h3>
      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
        <X size={20} />
      </button>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* Form fields */}
    </div>
    
    {/* Footer */}
    <div className="p-6 border-t border-slate-200 flex gap-3">
      <Button className="flex-1">Save</Button>
      <button className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50">
        Cancel
      </button>
    </div>
  </div>
</div>
```

### Badges
```tsx
// Success
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
  Active
</span>

// Warning
<span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
  Pending
</span>

// Danger
<span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
  Inactive
</span>
```

## 📏 Spacing

- **Page padding**: `p-8`
- **Section margin**: `mb-6` or `mb-8`
- **Card padding**: `p-6`
- **Gap between elements**: `gap-4` or `gap-6`

## 🔤 Typography

### Headings
- **H1 (Page Title)**: `text-3xl font-bold text-slate-900`
- **H2 (Section)**: `text-2xl font-bold text-slate-900`
- **H3 (Card Title)**: `text-xl font-bold text-slate-900`

### Body Text
- **Primary**: `text-slate-900`
- **Secondary**: `text-slate-600`
- **Muted**: `text-slate-500`

## 🎭 Animations

### Hover Effects
```tsx
className="hover:shadow-lg transition-all duration-300"
className="hover:bg-slate-50 transition-colors"
```

### Loading State
```tsx
<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
```

## 📱 Responsive

### Grid Breakpoints
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

### Hide on Mobile
```tsx
className="hidden lg:block"
```

## ✅ Checklist cho mỗi trang

- [ ] Page container với gradient background
- [ ] PageHeader component
- [ ] Stats grid (4 columns)
- [ ] Search & filters bar
- [ ] Table với rounded corners và hover effects
- [ ] Modal với backdrop blur
- [ ] Consistent button styles
- [ ] Proper spacing (p-8, gap-6, mb-8)
- [ ] Hover effects và transitions
- [ ] Responsive grid layout
