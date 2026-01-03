'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, UserProfile } from '@/types/user';

interface AuthProps {
  initialMode?: 'login' | 'register';
  onBack?: () => void;
  showBackButton?: boolean;
}

export const Auth: React.FC<AuthProps> = ({ initialMode = 'login', onBack, showBackButton = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('staff'); // Mặc định là nhân viên
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('Việt Nam');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  const redirectByRole = (userRole: UserRole) => {
    switch (userRole) {
      case 'admin':
      case 'staff':
        // Admin và Staff đều vào trang admin, menu sẽ hiển thị theo quyền
        router.push('/admin');
        break;
      case 'teacher':
        router.push('/teacher');
        break;
      case 'student':
        router.push('/student');
        break;
      default:
        router.push('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const profile = await signIn(email, password);
        if (profile) {
          // Chuyển hướng đến dashboard
          redirectByRole(profile.role);
        }
      } else {
        if (!displayName.trim()) {
          setError('Vui lòng nhập họ và tên');
          setLoading(false);
          return;
        }

        // Prepare additional info
        const additionalInfo: Partial<UserProfile> = {};
        if (dateOfBirth) additionalInfo.dateOfBirth = dateOfBirth;
        if (address) additionalInfo.address = address;
        if (country) additionalInfo.country = country;
        if (phoneNumber) additionalInfo.phoneNumber = phoneNumber;
        if (workLocation) additionalInfo.workLocation = workLocation;

        const profile = await signUp(email, password, displayName, role, additionalInfo);

        // Hiển thị thông báo khác nhau tùy role
        if (profile.role === 'admin') {
          alert('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
          redirectByRole(profile.role);
        } else {
          alert('Đăng ký thành công! Tài khoản của bạn đang chờ quản trị viên duyệt. Vui lòng đợi email xác nhận.');
          // Quay về trang login
          setMode('login');
          setEmail('');
          setPassword('');
          setDisplayName('');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-[#5e3ed0]/30 backdrop-blur-xl border border-white/10">
        <div className="w-full h-full flex items-center justify-center p-8 relative bg-white/5">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="absolute top-8 left-8 flex items-center text-slate-400 hover:text-white transition-colors lg:hidden"
            >
              <ArrowLeft size={20} className="mr-2" /> Quay lại
            </button>
          )}

          <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-5 duration-500">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {mode === 'login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
              </h2>
              <p className="mt-2 text-slate-300">
                {mode === 'login'
                  ? 'Nhập thông tin để tiếp tục lộ trình học tập của bạn.'
                  : 'Bắt đầu hành trình chinh phục tri thức ngay hôm nay.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Họ và tên *</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Ngày sinh</label>
                      <input
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white transition-all [color-scheme:dark]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Số điện thoại</label>
                      <input
                        type="tel"
                        placeholder="0912345678"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Địa chỉ</label>
                    <input
                      type="text"
                      placeholder="Số nhà, đường, phường/xã, quận/huyện"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Quốc gia</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white transition-all [&>option]:bg-[#311898]"
                      >
                        <option value="Việt Nam">Việt Nam</option>
                        <option value="Hoa Kỳ">Hoa Kỳ</option>
                        <option value="Nhật Bản">Nhật Bản</option>
                        <option value="Hàn Quốc">Hàn Quốc</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Vị trí học việc</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Intern, Junior Dev"
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-300">Mật khẩu</label>
                  {mode === 'login' && (
                    <a href="#" className="text-sm font-medium text-[#53cafd] hover:text-[#3db9f5]">
                      Quên mật khẩu?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#53cafd] focus:bg-white/10 text-white placeholder-slate-500 transition-all pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full py-3.5 text-lg shadow-[#53cafd]/25" disabled={loading}>
                {loading ? 'Đang xử lý...' : (mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Miễn Phí')}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
              <button onClick={toggleMode} className="font-bold text-[#53cafd] hover:text-[#3db9f5] hover:underline">
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};