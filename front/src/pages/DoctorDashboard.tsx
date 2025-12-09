import { useState } from 'react';
import { User } from '../App';
import { LogOut, Plus, Search, Users, FileText, Calendar } from 'lucide-react';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;
  disease: string;
  lastVisit: string;
}

interface Prescription {
  id: string;
  patientId: string;
  disease: string;
  medicines: string[];
  instructions: string;
  date: string;
}

const mockPatients: Patient[] = [
  { id: '3', name: 'علی محمدی', age: 45, phone: '09121234567', disease: 'فشار خون', lastVisit: '1403/09/15' },
  { id: '6', name: 'مریم احمدی', age: 32, phone: '09122345678', disease: 'دیابت', lastVisit: '1403/09/14' },
  { id: '7', name: 'حسن رضایی', age: 58, phone: '09123456789', disease: 'قلبی', lastVisit: '1403/09/13' },
  { id: '8', name: 'فاطمه کریمی', age: 41, phone: '09124567890', disease: 'آسم', lastVisit: '1403/09/12' },
];

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: '3',
    disease: 'فشار خون',
    medicines: ['لوزارتان 50mg', 'آسپرین 80mg'],
    instructions: 'یک قرص صبح و یک قرص شب همراه با غذا',
    date: '1403/09/15'
  },
  {
    id: '2',
    patientId: '6',
    disease: 'دیابت',
    medicines: ['متفورمین 500mg', 'گلیبنکلامید 5mg'],
    instructions: 'دو بار در روز قبل از غذا',
    date: '1403/09/14'
  },
];

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [patients] = useState<Patient[]>(mockPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  const [newPrescription, setNewPrescription] = useState({
    disease: '',
    medicines: '',
    instructions: '',
  });

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const prescription: Prescription = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      disease: newPrescription.disease,
      medicines: newPrescription.medicines.split('\n').filter(m => m.trim()),
      instructions: newPrescription.instructions,
      date: new Date().toLocaleDateString('fa-IR'),
    };

    setPrescriptions([prescription, ...prescriptions]);
    setNewPrescription({ disease: '', medicines: '', instructions: '' });
    setShowPrescriptionForm(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(p =>
    p.name.includes(searchTerm) || p.disease.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
              <FileText className="size-5 sm:size-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-800">پنل پزشک</h1>
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
                <p className="text-gray-600 mb-1 text-sm sm:text-base">تعداد بیماران</p>
                <p className="text-gray-900">{patients.length}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">نسخه‌های صادر شده</p>
                <p className="text-gray-900">{prescriptions.length}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <FileText className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">ویزیت امروز</p>
                <p className="text-gray-900">3</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Calendar className="size-5 sm:size-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Patients List */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-gray-800 mb-3 sm:mb-4">لیست بیماران</h2>

            {/* Search */}
            <div className="mb-3 sm:mb-4 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 sm:size-5 text-gray-400" />
              <input
                type="text"
                placeholder="جستجوی بیمار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 sm:pr-10 pl-3 sm:pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              />
            </div>

            {/* Patients */}
            <div className="space-y-2 sm:space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowPrescriptionForm(false);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base">{patient.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm">{patient.age} سال</p>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm">
                      {patient.disease}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm space-y-0.5">
                    <p>شماره تماس: {patient.phone}</p>
                    <p>آخرین ویزیت: {patient.lastVisit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Form or Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {!selectedPatient ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 sm:py-0">
                <FileText className="size-12 sm:size-16 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base">یک بیمار را انتخاب کنید</p>
              </div>
            ) : !showPrescriptionForm ? (
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h2 className="text-gray-800">اطلاعات بیمار</h2>
                  <button
                    onClick={() => setShowPrescriptionForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    <Plus className="size-4 sm:size-5" />
                    نسخه جدید
                  </button>
                </div>

                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-gray-900 mb-2 text-sm sm:text-base">{selectedPatient.name}</h3>
                  <div className="text-gray-600 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                    <p>سن: {selectedPatient.age} سال</p>
                    <p>شماره تماس: {selectedPatient.phone}</p>
                    <p>بیماری: {selectedPatient.disease}</p>
                  </div>
                </div>

                {/* Patient Prescriptions */}
                <h3 className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">نسخه‌های قبلی</h3>
                <div className="space-y-2 sm:space-y-3">
                  {prescriptions
                    .filter(p => p.patientId === selectedPatient.id)
                    .map((prescription) => (
                      <div key={prescription.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900 text-sm sm:text-base">{prescription.disease}</span>
                          <span className="text-gray-600 text-xs sm:text-sm">{prescription.date}</span>
                        </div>
                        <div className="mb-2">
                          <p className="text-gray-700 mb-1 text-xs sm:text-sm">داروها:</p>
                          <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm">
                            {prescription.medicines.map((medicine, idx) => (
                              <li key={idx}>{medicine}</li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">دستورالعمل: {prescription.instructions}</p>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddPrescription}>
                <h2 className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">نسخه جدید برای {selectedPatient.name}</h2>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">بیماری</label>
                    <input
                      type="text"
                      value={newPrescription.disease}
                      onChange={(e) => setNewPrescription({ ...newPrescription, disease: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder="نام بیماری"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">داروها (هر دارو در یک خط)</label>
                    <textarea
                      value={newPrescription.medicines}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medicines: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      rows={4}
                      placeholder="لیست داروها..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">دستورالعمل مصرف</label>
                    <textarea
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      rows={3}
                      placeholder="توضیحات مصرف..."
                      required
                    />
                  </div>

                  <div className="flex gap-2 sm:gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                    >
                      ثبت نسخه
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPrescriptionForm(false)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}