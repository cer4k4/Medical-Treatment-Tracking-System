/**
 * این یک نمونه کامل از نحوه استفاده از API در PatientDashboard است
 * می‌توانید این کد را به عنوان الگو برای تبدیل کامپوننت‌های موجود استفاده کنید
 */

import { useState } from 'react';
import { User } from '../App';
import { LogOut, FileText, Calendar, Pill, User as UserIcon, Phone, RefreshCw } from 'lucide-react';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

export function ExamplePatientDashboardWithAPI({ user, onLogout }: PatientDashboardProps) {
  // ✅ استفاده از Hook برای دریافت نسخه‌ها از بک‌اند
  const { 
    prescriptions,     // لیست نسخه‌ها از بک‌اند
    isLoading,         // وضعیت بارگذاری
    error,             // خطای احتمالی
    fetchPrescriptions // تابع بارگذاری مجدد
  } = usePrescriptions({
    patientId: user.id,
    autoFetch: true    // بارگذاری خودکار هنگام mount شدن
  });

  const [selectedPrescription, setSelectedPrescription] = useState<any | null>(null);

  // هندلر بارگذاری مجدد
  const handleRefresh = async () => {
    toast.loading('در حال بارگذاری...');
    await fetchPrescriptions();
    toast.dismiss();
    toast.success('نسخه‌ها به‌روزرسانی شدند');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1>پنل بیمار</h1>
                <p className="text-sm text-gray-600">خوش آمدید، {user.name}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* دکمه بارگذاری مجدد */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">بارگذاری مجدد</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* آمار */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">تعداد نسخه‌ها</p>
                <p className="text-3xl mt-2">{prescriptions.length}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">دکتر معالج</p>
                <p className="text-xl mt-2">
                  {prescriptions[0]?.doctorName || 'نامشخص'}
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <UserIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">آخرین ویزیت</p>
                <p className="text-xl mt-2">
                  {prescriptions[0]?.date || '-'}
                </p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* مدیریت وضعیت‌های مختلف */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-6">
            <Pill className="w-6 h-6 text-blue-600" />
            <h2>نسخه‌های پزشکی</h2>
          </div>

          {/* ⚠️ نمایش خطا */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p>خطا: {error}</p>
              <button 
                onClick={fetchPrescriptions}
                className="mt-2 text-sm underline hover:no-underline"
              >
                تلاش مجدد
              </button>
            </div>
          )}

          {/* ⏳ نمایش لودینگ */}
          {isLoading && !prescriptions.length && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">در حال بارگذاری نسخه‌ها...</p>
            </div>
          )}

          {/* ✅ نمایش داده‌ها */}
          {!isLoading && prescriptions.length === 0 && !error && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">هیچ نسخه‌ای یافت نشد</p>
            </div>
          )}

          {!isLoading && prescriptions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  onClick={() => setSelectedPrescription(prescription)}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg text-blue-900">
                      {prescription.disease}
                    </h3>
                    <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                      {prescription.date}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">
                      <strong>داروها:</strong>
                      <ul className="mr-4 mt-1 space-y-1">
                        {prescription.medicines.map((med, index) => (
                          <li key={index} className="text-xs">• {med}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-gray-600">
                      <strong>دکتر:</strong> {prescription.doctorName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal نمایش جزئیات */}
        {selectedPrescription && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPrescription(null)}
          >
            <div 
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl text-blue-900">
                  {selectedPrescription.disease}
                </h2>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">تاریخ تجویز:</p>
                  <p className="text-lg">{selectedPrescription.date}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">دکتر معالج:</p>
                  <p className="text-lg">{selectedPrescription.doctorName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">داروهای تجویز شده:</p>
                  <ul className="space-y-2">
                    {selectedPrescription.medicines.map((med: string, index: number) => (
                      <li key={index} className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
                        <Pill className="w-4 h-4 text-blue-600" />
                        {med}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">دستورالعمل مصرف:</p>
                  <p className="bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedPrescription.instructions}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPrescription(null)}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
