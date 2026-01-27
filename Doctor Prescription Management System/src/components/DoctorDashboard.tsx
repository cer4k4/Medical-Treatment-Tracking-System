import { useEffect, useState } from 'react';
import { User } from '../App';
import { LogOut, Plus, Search, Users, FileText, Calendar, AlarmCheck, Check, CheckCheck, CheckCheckIcon, ListTodo } from 'lucide-react';
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


export function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [profile, setProfile] = useState<Doctor>(doctorProfile);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(false);
  const [showGlobalPrescriptionForm, setShowGlobalPrescriptionForm] = useState(false);
  const [dateTime,setdateTime] = useState('');
  const [countOfprescriptions,setcountOfprescriptions] = useState(0)
  const [countOfMariz,setCountOfMariz] = useState(0)
  const [countOfBehbod,setCountOfBehbod] = useState(0)
  const [countOfTodo,setCountOfTodo] = useState(0)
  const [countOfDone,setCountOfDone] = useState(0)

  const [newPrescription, setNewPrescription] = useState({
    title:'',
    description:'',
    patient:'',
    tip:'',
  });

  const handleLogOut = () => {
    onLogout()
    userService.logOut()
  }
  
  // ===== state برای تسک‌های بیمار =====
  const [patientTasks, setPatientTasks] = useState<ITask[]>([]);
  
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await userService.getProfileDoctor("");
        if (res.data?.successfully) {
          setCountOfBehbod(res.data.data.behbod)
          setCountOfMariz(res.data.data.mariz)
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
        title: newPrescription.title,
        description: newPrescription.description,
        patient: newPrescription.patient || 'اسکیزوفرنی',
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
        setcountOfprescriptions(countOfprescriptions+1)
        setNewPrescription({ title: '', patient: '', description: '', tip: '' });
        setShowGlobalPrescriptionForm(false);
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
              <h1 className="text-gray-800">پنل همیار</h1>
              <p className="text-gray-600 text-sm sm:text-base">{profile.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGlobalPrescriptionForm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <Plus className="size-4 sm:size-5" />
              جلسه جدید
            </button>
            <button
              onClick={ () => handleLogOut()}
              
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
                <p className="text-gray-800 mb-1 text-sm sm:text-base">تعداد افراد در حال آموزش</p>
                <p className="text-gray-600">{ countOfMariz }</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 mb-1 text-sm sm:text-base">تعداد آموزش دیدگان</p>
                <p className="text-gray-600">{ countOfBehbod }</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <Users className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-800 mb-1 text-sm sm:text-base">جلسات صادر شده</p>
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
                    setShowGlobalPrescriptionForm(false);
                    const res = await taskService.getTaskOfUser(patient._id);
                    const utcDate = res.data?.data?.startDate;
                    const shamsi = moment.utc(utcDate).local().format('jYYYY/jMM/jDD');
                    setdateTime('')
                    if (utcDate){
                      setdateTime(shamsi)
                    }
                    setSelectedPatient(true)
                    setPatientTasks(res.data?.data?.data || []);
                    setCountOfDone(res.data?.data?.taskDone || 0)
                    setCountOfTodo(res.data?.data?.todo || 0)
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
                {/* ... فرم جلسه جدید */}
                <h2 className="text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base">
                  جلسه جدید
                </h2>
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
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 text-sm sm:text-base">عنوان یا موضوع</label>
                    <input
                      type="text"
                      value={newPrescription.title}
                      onChange={(e) =>
                        setNewPrescription({ ...newPrescription, title: e.target.value })
                      }
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                      placeholder="موضوع یا عنوان جلسه چیست"
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
                      ثبت
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGlobalPrescriptionForm(false);
                        setNewPrescription({ patient: '', description: '', tip: '',title:'' });
                      }}
                      className="flex-1 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              </form>
            ) : (
            <>
            {selectedPatient ? (<>
              <div className="bg-white-100 p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 mb-1 text-sm sm:text-base"> تاریخ شروع دوره</p>
                    <p className="text-gray-700">{ dateTime }</p>
                  </div>
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                    <Calendar className="size-5 sm:size-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 mb-1 text-sm sm:text-base">جلسات گذرانده شده</p>
                    <p className="text-gray-600">{ countOfDone }</p>
                  </div>
                  <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                    <CheckCheck className="size-5 sm:size-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-800 mb-1 text-sm sm:text-base"> جلسات مانده </p>
                    <p className="text-gray-600">{ countOfTodo }</p>
                  </div>
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                    <ListTodo className="size-5 sm:size-6 text-blue-600" />
                  </div>
                </div>
              </div>
              {patientTasks.map((task) =>
                <>
                <br></br>
                  <div className={`bg-white-100 p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1
                    ${task.status ? 'bg-green-100 border-green-600 text-white scale-110' : 'bg-blue-100 border-gray-300 hover:scale-105'}
                    `}>
                    {task.status ? (<CheckCheck className="size-5 sm:size-6 text-green-600" />):(<ListTodo className="size-5 sm:size-6 text-blue-600" />)}
                    <div className="mb-3 sm:mb-3">
                      <p className="text-gray-800 mb-1 text-sm sm:text-base"> موضوع یا عنوان</p>
                      <h3 className="text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base"> </h3>
                      <div className="p-3 sm:p-4 bg-white border rounded-lg">
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                          {task?.title}
                        </p>
                      </div>
                    </div>
                    {/* دستورالعمل و نکته */}
                    <div className="mb-3 sm:mb-3">
                      <p className="text-gray-800 mb-1 text-sm sm:text-base"> توضیحات</p>
                      <h3 className="text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base"> </h3>
                      <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                          {task?.description}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                        <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                          <strong>توجه:</strong> {task?.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>):(<></>)}

            </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
