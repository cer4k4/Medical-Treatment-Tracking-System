import { useEffect, useState } from 'react';
import { User } from '../App';
import { LogOut, Plus, Search, Users, FileText, Calendar } from 'lucide-react';
import { Doctor, Patient, userService } from '../apis/user/user.services';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Prescription {
  _id: string;
  patientId: string;
  patient: string;
}

const doctorProfile: Doctor = {};
const mockPatients: Patient[] = [];

const mockPrescriptions: Prescription[] = [
  // {
  //   id: '1',
  //   patientId: '3',
  //   patient: 'فشار خون',
  //   medicines: ['لوزارتان 50mg', 'آسپرین 80mg'],
  //   instructions: 'یک قرص صبح و یک قرص شب همراه با غذا',
  //   date: '1403/09/15',
  // },
  // {
  //   id: '2',
  //   patientId: '6',
  //   patient: 'دیابت',
  //   medicines: ['متفورمین 500mg', 'گلیبنکلامید 5mg'],
  //   instructions: 'دو بار در روز قبل از غذا',
  //   date: '1403/09/14',
  // },
];

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [profile, setProfile] = useState<Doctor>(doctorProfile);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showGlobalPrescriptionForm, setShowGlobalPrescriptionForm] = useState(false);
  const [newPrescription, setNewPrescription] = useState({
    title:'',
    description:'',
    patient:'',
    tip:'',
  });

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await userService.getProfileDoctor();
        if (res.data?.successfully) {
          console.log('Doctor profile:', res.data.data.doctor);
          setProfile(res.data.data.doctor);
          setPatients(res.data.data.doctor.patients || []);
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const prescription: Prescription = {
      _id: Date.now().toString(),
      patientId: selectedPatient._id,
      patient: newPrescription.patient,
      // description: newPrescription.description,
      // date: new Date().toLocaleDateString('fa-IR'),
    };

    setPrescriptions([prescription, ...prescriptions]);
    setNewPrescription({ title:'',patient: '', description: '', tip: '' });
    setShowGlobalPrescriptionForm(false);
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(
    (p) => p.fullName.includes(searchTerm) || p.patient?.includes(searchTerm)
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
              <p className="text-gray-600 text-sm sm:text-base">{profile.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Global "نسخه جدید" button */}
            <button
              onClick={() => setShowGlobalPrescriptionForm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Plus className="size-4 sm:size-5" />
              نسخه جدید
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <LogOut className="size-4 sm:size-5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
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
                  key={patient._id}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={() => {
                    // فقط انتخاب بیمار، بدون باز کردن فرم نسخه جدید
                    setSelectedPatient(patient);
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-gray-900 text-sm sm:text-base">{patient.fullName}</h3>
                    </div>
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm">
                      {patient.patient}
                    </span>
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm space-y-0.5">
                    <p>شماره تماس: {patient.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Form or Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {/* فرم نسخه جدید فقط وقتی دکمه بالای هدر زده شده */}
            {showGlobalPrescriptionForm ? (
              <form onSubmit={handleAddPrescription}>
                <h2 className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  نسخه جدید {selectedPatient ? `برای ${selectedPatient.fullName}` : ''}
                </h2>

                {/* {!selectedPatient && (
                  <div className="mb-3">
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">انتخاب بیمار</label>
                    <select
                      value={selectedPatient || ''}
                      onChange={(e) => {
                        const patient = patients.find((p) => p._id === e.target.value) || null;
                        setSelectedPatient(patient);
                      }}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      required
                    >
                      <option value="">یک بیمار انتخاب کنید</option>
                      {patients.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.fullName}
                        </option>
                      ))}
                    </select>
                  </div>
                )} */}

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">بیماری</label>
                    <input
                      type="text"
                      value={newPrescription.patient}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, patient: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder="نام بیماری"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                      توضیحات و تمرینات
                    </label>
                    <textarea
                      value={newPrescription.description}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, description: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      rows={4}
                      placeholder="توضیح مطالب..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">
                      نکات
                    </label>
                    <textarea
                      value={newPrescription.tip}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, tip: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      rows={3}
                      placeholder="نکاتی که نیاز هست بیمار اطلاع داشته باشه..."
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
                      onClick={() => {
                        setShowGlobalPrescriptionForm(false);
                        setSelectedPatient(null);
                        setNewPrescription({ patient: '', description: '', tip: '',title:'' });
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </form>
            ) : selectedPatient ? (
              // اطلاعات بیمار و نسخه‌های قبلی
              <div>
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-gray-900 mb-2 text-sm sm:text-base">{selectedPatient.fullName}</h3>
                  <div className="text-gray-600 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
                    <p>شماره تماس: {selectedPatient.phoneNumber}</p>
                    <p>بیماری: {selectedPatient.patient}</p>
                  </div>
                </div>

                <h3 className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">نسخه‌های قبلی</h3>
                <div className="space-y-2 sm:space-y-3">
                  {prescriptions
                    .filter((p) => p.patientId === selectedPatient._id)
                    .map((prescription) => (
                      <div key={prescription._id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-900 text-sm sm:text-base">{prescription.patient}</span>
                          {/* <span className="text-gray-600 text-xs sm:text-sm">{prescription.date}</span> */}
                        </div>
                        <div className="mb-2">
                          {/* <p className="text-gray-700 mb-1 text-xs sm:text-sm">داروها:</p>
                          <ul className="list-disc list-inside text-gray-600 text-xs sm:text-sm">
                            {prescription.medicines.map((medicine, idx) => (
                              <li key={idx}>{medicine}</li>
                            ))}
                          </ul> */}
                        </div>
                        {/* <p className="text-gray-600 text-xs sm:text-sm">دستورالعمل: {prescription.instructions}</p> */}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 sm:py-0">
                <FileText className="size-12 sm:size-16 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base">یک بیمار را انتخاب کنید</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
