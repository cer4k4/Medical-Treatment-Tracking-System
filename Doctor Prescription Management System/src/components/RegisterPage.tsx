import { useEffect, useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';
import { CreateUserRequest, userService } from '../apis/user/user.services';
import { taskService } from '../apis/task/task.services';

interface RegisterPageProps {
  onRegister: (data: any) => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    patient: '',
    password: '',
    phoneNumber: '',
    doctor: '',
  });

  const [doctors, setDoctors] = useState<
    { id: string; name: string; specialty: string }[]
  >([]);

  const [patients, setPatients] = useState<string[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);

  /* دریافت لیست پزشکان */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await userService.getListDoctors();
        if (res.data?.data?.doctors) {
          setDoctors(
            res.data.data.doctors.map((d: any) => ({
              id: d._id,
              name: d.fullName,
              specialty: d.specialty || '',
            }))
          );
        }
      } catch (err) {
        console.error('خطا در دریافت پزشکان', err);
      }
    };

    fetchDoctors();
  }, []);

  /* انتخاب پزشک → دریافت بیماری‌ها */
  const handleDoctorChange = async (doctorId: string) => {
    setFormData(prev => ({
      ...prev,
      doctor: doctorId,
      patient: '',
    }));

    if (!doctorId) {
      setPatients([]);
      return;
    }

    try {
      setLoadingPatients(true);
      const res = await taskService.getPatientOfDoctor(doctorId);
      if (res.data?.data) {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.error('خطا در دریافت بیماری‌ها', err);
      setPatients([]);
    } finally {
      setLoadingPatients(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const req: CreateUserRequest = {
        fullName: formData.fullName,
        username: formData.username,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        doctor: formData.doctor,
        patient: formData.patient,
        role: 'user',
        specialty: '',
      };

      const res = await userService.createUser(req);
      if (res.data) {
        onBackToLogin();
      }
    } catch (err) {
      console.error('خطا در ثبت نام', err);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-6"
        >
          <ArrowRight className="size-4 sm:size-5" />
          بازگشت به ورود
        </button>

        <h1 className="text-center text-gray-800 mb-4 sm:mb-6">
          ثبت نام بیمار جدید
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* نام */}
          <div>
            <label className="block text-gray-700 mb-2">
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={e =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* شماره تماس */}
          <div>
            <label className="block text-gray-700 mb-2">شماره تماس</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={e =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* نام کاربری */}
          <div>
            <label className="block text-gray-700 mb-2">نام کاربری</label>
            <input
              type="text"
              value={formData.username}
              onChange={e =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* رمز عبور */}
          <div>
            <label className="block text-gray-700 mb-2">رمز عبور</label>
            <input
              type="password"
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* پزشک */}
          <div>
            <label className="block text-gray-700 mb-2">انتخاب پزشک</label>
            <select
              value={formData.doctor}
              onChange={e => handleDoctorChange(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">پزشک مورد نظر را انتخاب کنید</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.specialty}
                </option>
              ))}
            </select>
          </div>

          {/* بیماری */}
          <div>
            <label className="block text-gray-700 mb-2">بیماری</label>
            <select
              value={formData.patient}
              onChange={e =>
                setFormData({ ...formData, patient: e.target.value })
              }
              disabled={!formData.doctor || loadingPatients}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100"
              required
            >
              <option value="">
                {loadingPatients
                  ? 'در حال دریافت...'
                  : 'بیماری را انتخاب کنید'}
              </option>
              {patients.map((p, i) => (
                <option key={i} value={p}>
                  {p}
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
