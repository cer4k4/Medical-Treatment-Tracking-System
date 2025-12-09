import { useState } from 'react';
import { LogIn, Stethoscope } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onShowRegister: () => void;
}

export function LoginPage({ onLogin, onShowRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <div className="bg-blue-600 p-2 sm:p-3 rounded-full">
            <Stethoscope className="size-6 sm:size-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-center text-gray-800 mb-2">سیستم مدیریت نسخه پزشکی</h1>
        <p className="text-center text-gray-600 mb-4 sm:mb-6">وارد حساب کاربری خود شوید</p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="size-4 sm:size-5" />
            ورود به سیستم
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center">
          <button
            onClick={onShowRegister}
            className="text-blue-600 hover:text-blue-700"
          >
            ثبت نام بیمار جدید
          </button>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm">
          <p className="text-gray-600 mb-2">حساب‌های آزمایشی:</p>
          <div className="space-y-1 text-gray-700">
            <p>• مدیر: admin@clinic.com</p>
            <p>• دکتر: doctor@clinic.com</p>
            <p>• بیمار: patient@clinic.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}