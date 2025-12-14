import Swal from 'sweetalert2';
import { useState, useEffect } from 'react';
import { User } from '../App';
import { LogOut, UserPlus, Trash2, Search, Users, Stethoscope, Rss } from 'lucide-react';
import { userService, CreateUserRequest } from '../apis/user/user.services';
import { IUser } from '../apis/user/user.types';
import { IResponse } from '../lib/types/base';
import { response } from 'express';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countOfDoctors, setcountOfDoctors] = useState<number>();
  const [countOfPetions, setcountOfPetions] = useState<number>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    id: '',
    fullName: 'سس',
    password: '',
    phoneNumber: '',
    specialty: '',
    role: '',
    username: '',
  });
  // گرفتن دکترها از سرور
  useEffect(() => {
    fetchDoctors();
  }, []);

const fetchDoctors = async () => {
  try {
    const res = await userService.getDoctors();
    if (res.data){
      setcountOfPetions(res.data.data.total_petition)
      setcountOfDoctors(res.data.data.total_doctor)
      setDoctors(res.data.data.doctors)
    }
    
  } catch (err: any) {
    Swal.fire('خطا!', err.message || 'خطای سرور', 'error');
  }
};



  // اضافه کردن دکتر جدید
  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    const doctor: IUser = { ...newDoctor, _id:'',patientCount: 0};
    try {
      const user: CreateUserRequest = {
        username: doctor.username || '',
        fullName: doctor.fullName || '',
        password: doctor.password || '',
        specialty: doctor.specialty || '',
        phoneNumber: doctor.phoneNumber || '', 
        role: 'doctor',
        doctor: '',
        patient: '',
      };

      const res = await userService.createUser(user);
      if (res.error || !res.success) {
        Swal.fire('خطا!', res.error || 'خطایی رخ داده', 'error');
      } else {
        Swal.fire('🙂', res.message, 'success');
        // بعد از اضافه کردن، دوباره دکترها رو از سرور بگیر
        fetchDoctors();
      }
    } catch (err: any) {
      Swal.fire('خطا!', err?.err || 'خطای غیرمنتظره', 'error');
    }

    setNewDoctor({id:'1', fullName: 'kd', password: '13123', phoneNumber: '989', specialty: 'cedwr', role: '213', username: '3312312' });
    setShowAddForm(false);
  };

  // حذف دکتر
  const handleDeleteDoctor = async (id: string) => {
    try {
      const res = await userService.deleteUser(id); // فرض بر این است که چنین API دارید
      if (res.success) {
        Swal.fire('🙂', 'دکتر حذف شد', 'success');
        setDoctors(doctors.filter(d => d._id !== id));
      } else {
        Swal.fire('خطا!', res.error || 'خطا در حذف', 'error');
      }
    } catch (err: any) {
      Swal.fire('خطا!', err.message || 'خطای سرور', 'error');
    }
  };

  const filteredDoctors = doctors.filter(d => d.fullName.includes(searchTerm) || d.phoneNumber.includes(searchTerm) || d.specialty?.includes(searchTerm) || d.specialty?.includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-purple-600 p-1.5 sm:p-2 rounded-lg">
              <Users className="size-5 sm:size-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-800">پنل مدیریت</h1>
              <p className="text-gray-600 text-sm sm:text-base">{user.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="size-4 sm:size-5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">تعداد پزشکان</p>
                <p className="text-gray-900">{ countOfDoctors }</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <Stethoscope className="size-5 sm:size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">تعداد بیماران</p>
                <p className="text-gray-900">{ countOfPetions }</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">بهبود یافتگان</p>
                <p className="text-gray-900">
                  {doctors.length > 0 ? Math.round(doctors.reduce((sum, d) => sum + d.patientCount, 0) / doctors.length) : 0}
                </p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Management */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <h2 className="text-gray-800">مدیریت پزشکان</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <UserPlus className="size-4 sm:size-5" />
              افزودن پزشک جدید
            </button>
          </div>

          {/* Add Doctor Form */}
          {showAddForm && (
            <form onSubmit={handleAddDoctor} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={newDoctor.fullName}
                  onChange={(e) => setNewDoctor({ ...newDoctor, fullName: e.target.value })}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="شماره همراه"
                  value={newDoctor.phoneNumber}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phoneNumber: e.target.value })}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="تخصص"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="text"
                  placeholder="نام کاربری"
                  value={newDoctor.username}
                  onChange={(e) => setNewDoctor({ ...newDoctor, username: e.target.value })}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  required
                />
                <input
                  type="password"
                  placeholder="گذرواژه"
                  value={newDoctor.password}
                  onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                ذخیره
              </button>
            </form>
          )}

          {/* Search */}
          <div className="mb-4 sm:mb-6 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 sm:size-5 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی پزشک..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          {/* Doctors Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-gray-700">نام پزشک</th>
                  <th className="px-6 py-3 text-right text-gray-700">شماره همراه</th>
                  <th className="px-6 py-3 text-right text-gray-700">تخصص</th>
                  <th className="px-6 py-3 text-right text-gray-700">تعداد بیماران</th>
                  <th className="px-6 py-3 text-right text-gray-700">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{doctor.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.phoneNumber}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.specialty}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.patientCount}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteDoctor(doctor._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Doctors Cards - Mobile */}
          <div className="md:hidden space-y-3">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{doctor.fullName}</h3>
                    <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">{doctor.phoneNumber}</p>
                  <p className="text-gray-600">بیماران: {doctor.patientCount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
