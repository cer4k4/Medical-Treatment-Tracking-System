import { useEffect, useState } from 'react';
import { User } from '../App';
import { LogOut, Plus, Search, Users, FileText, Calendar, AlarmCheck } from 'lucide-react';
import { Doctor, Patient, userService } from '../apis/user/user.services';
import { ITask } from '../apis/task/task.types';
import { taskService } from '../apis/task/task.services';
import moment from 'moment-jalaali';

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
  // نمونه نسخه‌های mock
];

export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [profile, setProfile] = useState<Doctor>(doctorProfile);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showGlobalPrescriptionForm, setShowGlobalPrescriptionForm] = useState(false);
  const [dateTime,setdateTime] = useState('');
  const [countOfprescriptions,setcountOfprescriptions] = useState(0)
  const [newPrescription, setNewPrescription] = useState({
    title:'',
    description:'',
    patient:'',
    tip:'',
  });

  // ===== state برای تسک‌های بیمار =====
  const [patientTasks, setPatientTasks] = useState<ITask[]>([]);
  
  useEffect(() => {
    if (selectedPatient) {
      async () => {
        const res = await taskService.getTaskOfUser(selectedPatient._id);
        setPatientTasks(res.data?.data?.data || []);
      }
      console.log("Selected patient changed:", patientTasks);
    }
  }, [selectedPatient]);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await userService.getProfileDoctor();
        if (res.data?.successfully) {
          setProfile(res.data.data.doctor);
          setPatients(res.data.data.doctor.patients || []);
          setcountOfprescriptions(res.data.data.prescriptions)
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
      }
    };
    fetchDoctorProfile();
  }, []);

  const handleAddPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: ITask = {
        title: newPrescription.title || "نسخه بیماری",
        description: newPrescription.description,
        patient: newPrescription.patient,
        tip: newPrescription.tip,
      };

      const res = await taskService.createTask(payload);
      if (res.data) {
        const createdTask = res.data;
        const prescription: Prescription = {
          _id: createdTask._id || '',
          patientId: '_id',
          patient: createdTask.patient,
        };
        setNewPrescription({ title: '', patient: '', description: '', tip: '' });
        setShowGlobalPrescriptionForm(false);
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Error creating prescription:', error);
    }
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
                <p className="text-gray-600">{patients.length}</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">تعداد بهبود یافتگان</p>
                <p className="text-gray-600">{patients.length}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">نسخه‌های صادر شده</p>
                <p className="text-gray-600">{countOfprescriptions}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <FileText className="size-5 sm:size-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Patients List + Prescription Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Patients List */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-gray-800 mb-3 sm:mb-4">لیست بیماران</h2>

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

            <div className="space-y-2 sm:space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient._id}
                  className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                  onClick={async () => {
                    setSelectedPatient(patient);
                    const res = await taskService.getTaskOfUser(patient._id);
                    const utcDate = res.data?.data?.startDate;
                    const shamsi = moment.utc(utcDate).local().format('jYYYY/jMM/jDD');
                    console.log(utcDate)
                    setdateTime('')
                    if (utcDate){
                      setdateTime(shamsi)
                    }
                    setPatientTasks(res.data?.data?.data || []);
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

          {/* Prescription Panel */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {showGlobalPrescriptionForm ? (
              <form onSubmit={handleAddPrescription}>
                {/* ... فرم نسخه جدید */}
              </form>
            ) : (
              <>
              

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base"> تاریخ ویزیت</p>
                <p className="text-gray-900">{ dateTime }</p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Calendar className="size-5 sm:size-6 text-purple-600" />
              </div>
            </div>
          </div>
<br></br>
                {/* دستورالعمل و نکته */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">دستورالعمل مصرف</h3>
                  <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                      {patientTasks[0]?.description || 'لطفاً بیمار را انتخاب کنید تا دستورالعمل نمایش داده شود.'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                      <strong>توجه:</strong> {patientTasks[0]?.tip || 'نکته خاصی برای نمایش وجود ندارد.'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
