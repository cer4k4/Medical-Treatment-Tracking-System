# راهنمای استفاده از API Service Layer

این راهنما نحوه استفاده از service layer و hook‌های ایجاد شده در پروژه را توضیح می‌دهد.

## 📁 ساختار فایل‌ها

```
/services/
  ├── api.ts                    # سرویس اصلی API و تنظیمات
  ├── prescriptionService.ts    # عملیات مربوط به نسخه‌ها
  └── userService.ts            # عملیات مربوط به کاربران

/contexts/
  └── AuthContext.tsx           # Context برای مدیریت احراز هویت

/hooks/
  ├── usePrescriptions.ts       # Hook‌های مربوط به نسخه‌ها
  └── useUsers.ts               # Hook‌های مربوط به کاربران
```

## 🔧 تنظیمات اولیه

### 1. تنظیم URL بک‌اند

در فایل `.env` در ریشه پروژه:

```env
VITE_API_BASE_URL=http://localhost:4000/api
# یا
VITE_API_BASE_URL=https://your-backend-api.com/api
```

### 2. اضافه کردن AuthProvider به App

```tsx
// در فایل main.tsx یا index.tsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

## 📚 نمونه‌های استفاده

### 1️⃣ استفاده از Authentication

```tsx
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isLoading, user } = useAuth();
  
  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    
    if (result.success) {
      // ورود موفق - کاربر به state اضافه شده
      console.log('خوش آمدید!');
    } else {
      // نمایش خطا
      alert(result.error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      {/* فرم شما */}
    </form>
  );
}
```

### 2️⃣ استفاده از Prescriptions در Patient Dashboard

```tsx
import { usePrescriptions } from '../hooks/usePrescriptions';
import { useAuth } from '../contexts/AuthContext';

function PatientDashboard() {
  const { user } = useAuth();
  const { 
    prescriptions, 
    isLoading, 
    error, 
    fetchPrescriptions 
  } = usePrescriptions({
    patientId: user?.id,
    autoFetch: true  // خودکار بارگذاری می‌شود
  });

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  return (
    <div>
      <h2>نسخه‌های من</h2>
      {prescriptions.map(prescription => (
        <div key={prescription.id}>
          <h3>{prescription.disease}</h3>
          <p>{prescription.instructions}</p>
          <ul>
            {prescription.medicines.map((med, i) => (
              <li key={i}>{med}</li>
            ))}
          </ul>
        </div>
      ))}
      
      <button onClick={fetchPrescriptions}>
        بارگذاری مجدد
      </button>
    </div>
  );
}
```

### 3️⃣ ایجاد نسخه جدید در Doctor Dashboard

```tsx
import { usePrescriptions } from '../hooks/usePrescriptions';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

function CreatePrescriptionForm({ patientId }: { patientId: string }) {
  const { createPrescription, isLoading } = usePrescriptions({ 
    autoFetch: false 
  });
  
  const [formData, setFormData] = useState({
    disease: '',
    medicines: [''],
    instructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createPrescription({
      patientId,
      disease: formData.disease,
      medicines: formData.medicines.filter(m => m.trim() !== ''),
      instructions: formData.instructions
    });

    if (result.success) {
      toast.success('نسخه با موفقیت ایجاد شد');
      // پاک کردن فرم
      setFormData({ disease: '', medicines: [''], instructions: '' });
    } else {
      toast.error(result.error || 'خطا در ایجاد نسخه');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.disease}
        onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
        placeholder="نام بیماری"
      />
      
      {/* فیلدهای دیگر */}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'در حال ذخیره...' : 'ایجاد نسخه'}
      </button>
    </form>
  );
}
```

### 4️⃣ مدیریت دکترها در Admin Dashboard

```tsx
import { useDoctors } from '../hooks/useUsers';
import { useState } from 'react';

function AdminDoctorManagement() {
  const { 
    doctors, 
    isLoading, 
    error, 
    createDoctor, 
    deleteDoctor 
  } = useDoctors();

  const [showForm, setShowForm] = useState(false);

  const handleCreateDoctor = async (data: any) => {
    const result = await createDoctor({
      name: data.name,
      email: data.email,
      password: data.password,
      specialty: data.specialty,
      phone: data.phone
    });

    if (result.success) {
      setShowForm(false);
      alert('دکتر با موفقیت ایجاد شد');
    } else {
      alert(result.error);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    if (confirm('آیا مطمئن هستید؟')) {
      const result = await deleteDoctor(doctorId);
      
      if (result.success) {
        alert('دکتر حذف شد');
      } else {
        alert(result.error);
      }
    }
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h2>مدیریت دکترها ({doctors.length})</h2>
      
      <button onClick={() => setShowForm(true)}>
        افزودن دکتر جدید
      </button>

      <ul>
        {doctors.map(doctor => (
          <li key={doctor.id}>
            <span>{doctor.name} - {doctor.specialty}</span>
            <button onClick={() => handleDeleteDoctor(doctor.id)}>
              حذف
            </button>
          </li>
        ))}
      </ul>

      {showForm && (
        <DoctorForm 
          onSubmit={handleCreateDoctor}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
```

### 5️⃣ مدیریت بیماران دکتر

```tsx
import { usePatients } from '../hooks/useUsers';
import { useAuth } from '../contexts/AuthContext';

function DoctorPatientsList() {
  const { user } = useAuth();
  const { patients, isLoading, fetchPatients } = usePatients(user?.id);

  if (isLoading) return <div>در حال بارگذاری...</div>;

  return (
    <div>
      <h2>بیماران من ({patients.length})</h2>
      
      <button onClick={fetchPatients}>
        بارگذاری مجدد
      </button>

      <table>
        <thead>
          <tr>
            <th>نام</th>
            <th>ایمیل</th>
            <th>تعداد نسخه‌ها</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.email}</td>
              <td>{patient.prescriptionsCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 6️⃣ استفاده مستقیم از Service (بدون Hook)

گاهی ممکن است نیاز باشید مستقیماً از service استفاده کنید:

```tsx
import { prescriptionService } from '../services/prescriptionService';
import { userService } from '../services/userService';

async function someFunction() {
  // دریافت یک نسخه خاص
  const prescriptionResponse = await prescriptionService.getPrescription('123');
  
  if (prescriptionResponse.success && prescriptionResponse.data) {
    console.log(prescriptionResponse.data);
  }

  // دریافت اطلاعات یک کاربر
  const userResponse = await userService.getUser('456');
  
  if (userResponse.success && userResponse.data) {
    console.log(userResponse.data);
  }
}
```

### 7️⃣ ویرایش و حذف نسخه

```tsx
import { usePrescriptions } from '../hooks/usePrescriptions';

function PrescriptionActions({ prescriptionId }: { prescriptionId: string }) {
  const { updatePrescription, deletePrescription } = usePrescriptions({
    autoFetch: false
  });

  const handleEdit = async () => {
    const result = await updatePrescription(prescriptionId, {
      instructions: 'دستورالعمل جدید'
    });

    if (result.success) {
      alert('نسخه ویرایش شد');
    }
  };

  const handleDelete = async () => {
    const result = await deletePrescription(prescriptionId);

    if (result.success) {
      alert('نسخه حذف شد');
    }
  };

  return (
    <div>
      <button onClick={handleEdit}>ویرایش</button>
      <button onClick={handleDelete}>حذف</button>
    </div>
  );
}
```

## 🔐 مدیریت احراز هویت و توکن

توکن احراز هویت به صورت خودکار در `localStorage` ذخیره می‌شود و در تمام درخواست‌های API ارسال می‌گردد.

```tsx
import { useAuth } from '../contexts/AuthContext';

function SomeComponent() {
  const { user, logout } = useAuth();

  // دسترسی به اطلاعات کاربر فعلی
  console.log(user?.name);
  console.log(user?.role); // 'admin' | 'doctor' | 'patient'

  // خروج از سیستم
  const handleLogout = () => {
    logout(); // توکن پاک می‌شود
  };

  return <button onClick={handleLogout}>خروج</button>;
}
```

## 🎯 Best Practices

### 1. استفاده از Hook‌ها برای دیتا

```tsx
// ✅ خوب - استفاده از Hook
const { prescriptions, isLoading } = usePrescriptions();

// ❌ بد - استفاده مستقیم از service در component
const [data, setData] = useState([]);
useEffect(() => {
  prescriptionService.getPatientPrescriptions().then(res => setData(res.data));
}, []);
```

### 2. مدیریت خطاها

```tsx
const { prescriptions, error, isLoading } = usePrescriptions();

if (error) {
  return <ErrorComponent message={error} />;
}

if (isLoading) {
  return <LoadingSpinner />;
}

return <PrescriptionList data={prescriptions} />;
```

### 3. استفاده از Toast برای اعلان‌ها

```tsx
import { toast } from 'sonner@2.0.3';

const handleSubmit = async () => {
  const result = await createPrescription(data);
  
  if (result.success) {
    toast.success('عملیات موفق');
  } else {
    toast.error(result.error || 'خطا در انجام عملیات');
  }
};
```

## 🌐 API Endpoints مورد انتظار

Backend شما باید این endpoint‌ها را پیاده‌سازی کند:

### Authentication
- `POST /api/auth/login` - ورود کاربر
- `POST /api/auth/register` - ثبت‌نام کاربر
- `POST /api/auth/logout` - خروج کاربر
- `GET /api/auth/me` - دریافت اطلاعات کاربر فعلی

### Prescriptions
- `GET /api/prescriptions/my` - نسخه‌های بیمار فعلی
- `GET /api/prescriptions/patient/:id` - نسخه‌های یک بیمار خاص
- `GET /api/prescriptions/doctor` - نسخه‌های دکتر فعلی
- `GET /api/prescriptions/:id` - یک نسخه خاص
- `POST /api/prescriptions` - ایجاد نسخه جدید
- `PUT /api/prescriptions/:id` - ویرایش نسخه
- `DELETE /api/prescriptions/:id` - حذف نسخه

### Users
- `GET /api/users/doctors` - لیست دکترها
- `GET /api/users/patients` - لیست بیماران
- `GET /api/users/doctors/:id/patients` - بیماران یک دکتر
- `POST /api/users/doctors` - ایجاد دکتر جدید (admin)
- `POST /api/users/patients` - ایجاد بیمار جدید
- `PUT /api/users/:id` - ویرایش کاربر
- `DELETE /api/users/:id` - حذف کاربر

## 🧪 تست با Mock Data

در صورتی که backend هنوز آماده نیست، می‌توانید در فایل `api.ts` از mock data استفاده کنید:

```tsx
// در فایل /services/api.ts
const USE_MOCK_DATA = true; // برای تست

private async request<T>(endpoint: string, options: RequestInit = {}) {
  if (USE_MOCK_DATA) {
    // بازگشت داده‌های mock
    return this.getMockResponse<T>(endpoint);
  }
  
  // کد واقعی...
}
```

## 🔄 بارگذاری مجدد داده‌ها

```tsx
const { fetchPrescriptions, prescriptions } = usePrescriptions();

// بارگذاری مجدد دستی
<button onClick={fetchPrescriptions}>بارگذاری مجدد</button>

// بارگذاری مجدد خودکار هر 30 ثانیه
useEffect(() => {
  const interval = setInterval(fetchPrescriptions, 30000);
  return () => clearInterval(interval);
}, []);
```

---

با این ساختار، شما می‌توانید به راحتی backend خود را به frontend متصل کنید! 🚀
