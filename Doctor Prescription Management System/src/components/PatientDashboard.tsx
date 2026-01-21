import { useState, useEffect } from 'react';
import { User } from '../App';
import { LogOut, FileText, Calendar, Pill, User as UserIcon, Phone, Check, Presentation } from 'lucide-react';
import { taskService } from '../apis/task/task.services';
import { userService } from '../apis/user/user.services';
import { IGetUserProfile } from '../apis/user/user.types';
import moment from 'moment-jalaali';
interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

interface Prescription {
  id: string;
  disease: string;
  medicines: string[];
  instructions: string;
  tip: string;
  date: string;
  doctorName: string;
  status: boolean; // وضعیت از سرور
}

function getCountOfDoneTask(list: Prescription[]) {
  let count: number = 0 
  for(let p of list){
    if (!p.status){
      count++
    }
  }
  return count
}

function getCountOfTODoTask(list: Prescription[]) {
  let count: number = 0 
  for(let p of list){
    if (p.status){
      count++
    }
  }
  return count
}


export function PatientDashboard({ user,onLogout }: PatientDashboardProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  // const [patientname , setpatientname] = useState('');
  const [doctorname, setdoctorname] = useState('');
  const [special, setSpecial] = useState('');
  const [doctorNumber, setDoctorNumber] = useState('');
  const [taskDone,settaskDone] = useState(0);
  const [todoTask,settodoTask] = useState(0);
  const [dateTime,setdateTime] = useState('');
  useEffect(() => {
    async function getData() {
      const tasks = await taskService.getTaskOfUser("");
      if (tasks.data?.data?.data) {
        const mapped: Prescription[] = tasks.data.data.data.map(t => ({
          id: t.taskId || '',
          tip: t.tip,
          disease: t.title,
          medicines:  [],
          instructions: t.description,
          date: '',
          doctorName: t.creatorName,
          status: t.status || false
        }))
        setPrescriptions(mapped);
        setSpecial(tasks.data.data.data[0]?.specialty || '');
        setdoctorname(tasks.data.data.data[0]?.creatorName || '');
        setDoctorNumber(tasks.data.data.data[0]?.doctorPhoneNumber || '');
        settodoTask(tasks.data.data.todo)
        settaskDone(tasks.data.data.taskDone)
      }
      //settaskDone(tasks.data?.data?.taskDone || 0)
      //settodoTask(tasks.data?.data?.todo || 0)
      const utcDate = tasks.data?.data?.startDate;
      if (utcDate) {
        const shamsi = moment.utc(utcDate).local().format('jYYYY/jMM/jDD');
        setdateTime(shamsi);
      }
    }
    getData();
  }, []);
  const toggleCheck = async (id: string) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: !p.status } : p
      )
    );
    try {
      settaskDone(getCountOfDoneTask(prescriptions))
      settodoTask(getCountOfTODoTask(prescriptions))
      await taskService.updateStatusTask(id);
    } catch (error) {
      console.error('خطا در به‌روزرسانی وضعیت:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-green-600 p-1.5 sm:p-2 rounded-lg">
              <UserIcon className="size-5 sm:size-6 text-white" />
            </div>
            <div>
              <h1 className="text-gray-800">پنل بیمار</h1>
              <p className="text-gray-600 text-sm sm:text-base">{ user.name }</p>
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
        {/* Doctor Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="bg-white/20 p-2 sm:p-4 rounded-full">
              <UserIcon className="size-6 sm:size-8" />
            </div>
            <div className="flex-1">
              <h2>پزشک معالج شما</h2>
              <p className="text-blue-100 text-sm sm:text-base">{doctorname} - {special}</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base">
              <Phone className="size-4 sm:size-5" />
              <span>{ doctorNumber }</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">امور در حال پیگیری</p>
                <p className="text-gray-900">{ todoTask }</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                <FileText className="size-5 sm:size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">تاریخ ویزیت</p>
                <p className="text-gray-900"></p>{ dateTime }
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                <Calendar className="size-5 sm:size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1 text-sm sm:text-base">کار های انجام شده</p>
                <p className="text-gray-900">
                  { taskDone }
                </p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
                <Pill className="size-5 sm:size-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Prescriptions List */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-gray-800 mb-4 sm:mb-6">نسخه‌های پزشکی</h2>

            <div className="space-y-3 sm:space-y-4">
              {prescriptions.map((prescription) => {
                const isChecked = prescription.status;

                return (
                  <div
                    key={prescription.id}
                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all flex items-center
                      ${selectedPrescription?.id === prescription.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                      ${isChecked ? 'bg-green-50 border-green-500' : ''}
                    `}
                  >

                    <div
                      onClick={() => setSelectedPrescription(prescription)}
                      className="flex-1"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{prescription.disease}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm">دکتر: {prescription.doctorName}</p>
                        </div>
                        <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm whitespace-nowrap mr-2">
                          {prescription.date}
                        </span>
                      </div>

                    {/* Check Button */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleCheck(prescription.id);
                      }}
                      className={`flex-shrink-0 flex items-center justify-center mr-3 w-8 h-8 rounded-full border transition-all duration-200
                        ${isChecked ? 'bg-green-600 border-green-600 text-white scale-110' : 'bg-white border-gray-300 hover:scale-105'}
                      `}
                    >
                      <Check className="size-4" />
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prescription Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {!selectedPrescription ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 sm:py-0">
                <FileText className="size-12 sm:size-16 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base">یک نسخه را انتخاب کنید</p>
              </div>
            ) : (
              <div>
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h2 className="text-gray-800">جزئیات نسخه</h2>
                    <span className="text-gray-600 text-xs sm:text-sm">{selectedPrescription.date}</span>
                  </div>
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-gray-900 mb-1 text-sm sm:text-base">{selectedPrescription.disease}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">تجویز شده توسط: {selectedPrescription.doctorName}</p>
                  </div>
                </div>

                {/* Medicines */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Pill className="size-4 sm:size-5 text-blue-600" />
                    <h3 className="text-gray-800 text-sm sm:text-base"></h3>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    {selectedPrescription.medicines.map((medicine, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="size-1.5 sm:size-2 bg-blue-600 rounded-full flex-shrink-0" />
                        <span className="text-gray-700 text-xs sm:text-sm">{medicine}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">دستورالعمل مصرف</h3>
                  <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                      {selectedPrescription.instructions}
                    </p>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                    <strong>توجه:</strong> { selectedPrescription.tip }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
