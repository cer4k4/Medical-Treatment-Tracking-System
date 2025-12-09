/**
 * نمونه استفاده از API در DoctorDashboard
 * نشان می‌دهد چگونه دکتر می‌تواند بیماران و نسخه‌ها را مدیریت کند
 */

import { useState } from 'react';
import { User } from '../App';
import { LogOut, Users, FileText, Plus, Search } from 'lucide-react';
import { usePatients } from '../hooks/useUsers';
import { usePrescriptions } from '../hooks/usePrescriptions';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

export function ExampleDoctorDashboardWithAPI({ user, onLogout }: DoctorDashboardProps) {
  // ✅ دریافت لیست بیماران از بک‌اند
  const { 
    patients, 
    isLoading: patientsLoading, 
    error: patientsError,
    fetchPatients 
  } = usePatients(user.id);

  // ✅ مدیریت نسخه‌ها
  const {
    createPrescription,
    isLoading: prescriptionLoading
  } = usePrescriptions({ autoFetch: false });

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Form state برای ایجاد نسخه جدید
  const [newPrescription, setNewPrescription] = useState({
    disease: '',
    medicines: [''],
    instructions: ''
  });

  // فیلتر بیماران بر اساس جستجو
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ هندلر ایجاد نسخه جدید
  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      toast.error('لطفاً یک بیمار انتخاب کنید');
      return;
    }

    // فیلتر کردن داروهای خالی
    const medicines = newPrescription.medicines.filter(m => m.trim() !== '');

    if (medicines.length === 0) {
      toast.error('لطفاً حداقل یک دارو وارد کنید');
      return;
    }

    const result = await createPrescription({
      patientId: selectedPatient.id,
      disease: newPrescription.disease,
      medicines: medicines,
      instructions: newPrescription.instructions
    });

    if (result.success) {
      toast.success('نسخه با موفقیت ایجاد شد');
      
      // پاک کردن فرم
      setNewPrescription({
        disease: '',
        medicines: [''],
        instructions: ''
      });
      setShowCreateForm(false);
      setSelectedPatient(null);
    } else {
      toast.error(result.error || 'خطا در ایجاد نسخه');
    }
  };

  // اضافه کردن فیلد دارو جدید
  const addMedicineField = () => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: [...prev.medicines, '']
    }));
  };

  // حذف فیلد دارو
  const removeMedicineField = (index: number) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  // تغییر مقدار دارو
  const updateMedicine = (index: number, value: string) => {
    setNewPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.map((m, i) => i === index ? value : m)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white p-3 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1>پنل دکتر</h1>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* آمار */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">تعداد بیماران</p>
                <p className="text-3xl mt-2">{patients.length}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">نسخه‌های امروز</p>
                <p className="text-3xl mt-2">0</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-r-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">نسخه‌های این ماه</p>
                <p className="text-3xl mt-2">0</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* لیست بیماران */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-green-600" />
              <h2>بیماران من</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* جستجو */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="جستجوی بیمار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                نسخه جدید
              </button>
            </div>
          </div>

          {/* مدیریت خطا */}
          {patientsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              خطا: {patientsError}
            </div>
          )}

          {/* لودینگ */}
          {patientsLoading && (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* لیست بیماران */}
          {!patientsLoading && filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm ? 'بیماری یافت نشد' : 'هنوز بیماری ندارید'}
              </p>
            </div>
          )}

          {!patientsLoading && filteredPatients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      نام بیمار
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      ایمیل
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      تلفن
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      تعداد نسخه
                    </th>
                    <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {patient.phone || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {patient.prescriptionsCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowCreateForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          نسخه جدید
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal ایجاد نسخه */}
      {showCreateForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCreateForm(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl mb-6">ایجاد نسخه جدید</h2>

            {/* انتخاب بیمار */}
            {!selectedPatient && (
              <div className="mb-6">
                <label className="block text-sm mb-2 text-gray-700">انتخاب بیمار</label>
                <select
                  onChange={(e) => {
                    const patient = patients.find(p => p.id === e.target.value);
                    setSelectedPatient(patient);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">بیمار را انتخاب کنید</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.email}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedPatient && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-green-800">
                  <strong>بیمار:</strong> {selectedPatient.name}
                </p>
              </div>
            )}

            <form onSubmit={handleCreatePrescription} className="space-y-4">
              {/* نام بیماری */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">نام بیماری *</label>
                <input
                  type="text"
                  required
                  value={newPrescription.disease}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, disease: e.target.value }))}
                  placeholder="مثال: فشار خون"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* داروها */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-gray-700">داروها *</label>
                  <button
                    type="button"
                    onClick={addMedicineField}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    + افزودن دارو
                  </button>
                </div>
                {newPrescription.medicines.map((medicine, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={medicine}
                      onChange={(e) => updateMedicine(index, e.target.value)}
                      placeholder={`دارو ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    {newPrescription.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicineField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* دستورالعمل */}
              <div>
                <label className="block text-sm mb-2 text-gray-700">دستورالعمل مصرف *</label>
                <textarea
                  required
                  value={newPrescription.instructions}
                  onChange={(e) => setNewPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                  placeholder="نحوه مصرف دارو و توصیه‌های پزشکی..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* دکمه‌ها */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={prescriptionLoading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {prescriptionLoading ? 'در حال ذخیره...' : 'ثبت نسخه'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setSelectedPatient(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
