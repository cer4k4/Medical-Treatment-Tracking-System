import { useEffect,useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';
import { CreateUserRequest, userService } from '../apis/user/user.services';
import { error } from 'console';

interface RegisterPageProps {
  onRegister: (data: any) => void;
  onBackToLogin: () => void;
}

const mockDoctors = [];

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    petient: '',
    password: '',
    phoneNumber: '',
    doctor: '',
  });
  const [doctors, setDoctors] = useState<
    { id: string; name: string; specialty: string }[]
  >([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await userService.getListDoctors();

        if (res.data?.data?.doctors) {
          setDoctors(
            res.data.data.doctors.map((d: any) => ({
              id: d._id,
              name: d.fullName,
              specialty: d.specialty || ''
            }))
          );
        }
      } catch (err) {
        console.error("خطا در دریافت لیست پزشکان", err);
      }
    };

    fetchDoctors();
  }, []);
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     try {
    // فراخوانی endpoint backend
      let req : CreateUserRequest = {} as CreateUserRequest;
      req.fullName = formData.fullName
      req.password = formData.password
      req.username = formData.username
      req.doctor = formData.doctor
      req.patient = formData.petient
      req.role = 'user'
      req.phoneNumber = formData.phoneNumber
      req.specialty = ''
      console.log(req)
      const res = await userService.createUser(req);
      if (res.data) {
      // اگر می‌خوای بعد ثبت نام کاری انجام بدی
      console.log("ثبت نام موفق:", res.data);
      // مثلاً برگشت به صفحه ورود
      onBackToLogin();
    } else {
      
      console.error("خطا در ثبت نام:", res.error);
    }
  } catch (err) {
    console.error("خطای شبکه یا سرور:", err);
  }
    // onRegister(formData);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-6"
        >
          <ArrowRight className="size-4 sm:size-5" />
          بازگشت به ورود
        </button>

        <h1 className="text-center text-gray-800 mb-4 sm:mb-6">ثبت نام بیمار جدید</h1>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">نام و نام خانوادگی</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="نام کامل خود را وارد کنید"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">بیماری</label>
            <input
              type="text"
              value={formData.petient}
              onChange={(e) => setFormData({ ...formData, petient: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="چه نوع اختلالی دارید"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">شماره تماس</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="09123456789"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2"> نام کاربری</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="نام کاربری خود را به انگلیسی بنویسید"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">انتخاب پزشک</label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">پزشک مورد نظر را انتخاب کنید</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="size-4 sm:size-5" />
            ثبت نام
          </button>
        </form>
      </div>
    </div>
  );
}