# 🔌 راهنمای اتصال به Backend

این پروژه یک معماری کامل برای اتصال به backend آماده دارد. در اینجا خلاصه‌ای از فایل‌ها و نحوه استفاده آورده شده است.

## 📂 ساختار فایل‌های ایجاد شده

```
/services/                          # لایه سرویس API
  ├── api.ts                        # کلاس اصلی مدیریت درخواست‌ها
  ├── prescriptionService.ts        # سرویس نسخه‌های پزشکی
  └── userService.ts                # سرویس مدیریت کاربران

/contexts/                          # Context API برای state management
  └── AuthContext.tsx               # مدیریت احراز هویت

/hooks/                             # Custom Hooks برای استفاده آسان
  ├── usePrescriptions.ts           # Hook نسخه‌ها
  └── useUsers.ts                   # Hook کاربران

/examples/                          # نمونه‌های عملی
  ├── API_USAGE_GUIDE.md            # راهنمای کامل با مثال‌های کد
  ├── ExamplePatientDashboardWithAPI.tsx
  └── ExampleDoctorDashboardWithAPI.tsx

/.env.example                       # نمونه فایل تنظیمات
```

## 🚀 شروع سریع

### 1️⃣ تنظیم URL بک‌اند

فایل `.env` در ریشه پروژه بسازید:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

### 2️⃣ اضافه کردن AuthProvider

در فایل اصلی پروژه (`main.tsx` یا `index.tsx`):

```tsx
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

### 3️⃣ استفاده در کامپوننت‌ها

#### مثال: Login
```tsx
import { useAuth } from './contexts/AuthContext';

function LoginPage() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      // موفق ✅
    } else {
      alert(result.error);
    }
  };
}
```

#### مثال: دریافت نسخه‌ها
```tsx
import { usePrescriptions } from './hooks/usePrescriptions';

function PatientDashboard() {
  const { prescriptions, isLoading, error } = usePrescriptions();
  
  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;
  
  return (
    <div>
      {prescriptions.map(p => (
        <div key={p.id}>{p.disease}</div>
      ))}
    </div>
  );
}
```

#### مثال: ایجاد نسخه جدید
```tsx
import { usePrescriptions } from './hooks/usePrescriptions';

function DoctorDashboard() {
  const { createPrescription } = usePrescriptions({ autoFetch: false });
  
  const handleCreate = async () => {
    const result = await createPrescription({
      patientId: '123',
      disease: 'فشار خون',
      medicines: ['دارو 1', 'دارو 2'],
      instructions: 'دستورالعمل...'
    });
    
    if (result.success) {
      alert('ایجاد شد!');
    }
  };
}
```

## 📡 API Endpoints مورد نیاز

Backend شما باید این endpoint‌ها را پیاده‌سازی کند:

### Authentication
- `POST /api/auth/login` - ورود
- `POST /api/auth/register` - ثبت‌نام
- `GET /api/auth/me` - اطلاعات کاربر فعلی
- `POST /api/auth/logout` - خروج

### Prescriptions
- `GET /api/prescriptions/my` - نسخه‌های بیمار فعلی
- `GET /api/prescriptions/patient/:id` - نسخه‌های یک بیمار
- `POST /api/prescriptions` - ایجاد نسخه جدید
- `PUT /api/prescriptions/:id` - ویرایش نسخه
- `DELETE /api/prescriptions/:id` - حذف نسخه

### Users
- `GET /api/users/doctors` - لیست دکترها
- `GET /api/users/patients` - لیست بیماران
- `POST /api/users/doctors` - ایجاد دکتر (admin)
- `DELETE /api/users/:id` - حذف کاربر

## 🎯 ویژگی‌های کلیدی

✅ **مدیریت خودکار توکن** - توکن در localStorage ذخیره و در تمام درخواست‌ها ارسال می‌شود  
✅ **مدیریت خطا** - خطاهای شبکه و سرور به صورت خودکار هندل می‌شوند  
✅ **Loading States** - وضعیت بارگذاری برای تمام عملیات  
✅ **TypeScript Support** - تایپ‌های کامل برای همه API ها  
✅ **Custom Hooks** - استفاده آسان با کد تمیز  
✅ **Context API** - مدیریت state سراسری برای authentication  

## 📖 راهنمای کامل

برای مثال‌های بیشتر و توضیحات کامل، به فایل‌های زیر مراجعه کنید:

- **`/examples/API_USAGE_GUIDE.md`** - راهنمای جامع با 7+ مثال عملی
- **`/examples/ExamplePatientDashboardWithAPI.tsx`** - نمونه کامل Patient Dashboard
- **`/examples/ExampleDoctorDashboardWithAPI.tsx`** - نمونه کامل Doctor Dashboard

## 🔧 تنظیمات پیشرفته

### تغییر Base URL به صورت داینامیک
```tsx
import { apiService } from './services/api';

// در runtime
apiService.baseURL = 'https://new-api.com/api';
```

### استفاده از توکن سفارشی
```tsx
import { apiService } from './services/api';

apiService.setAuthToken('your-custom-token');
```

### Refresh Token (اختیاری)
```tsx
// در فایل api.ts، در متد request:
if (response.status === 401) {
  // توکن منقضی شده، تلاش برای refresh
  await this.refreshToken();
  // تلاش مجدد
  return this.request(endpoint, options);
}
```

## 🐛 عیب‌یابی

### خطای CORS
اگر با خطای CORS مواجه شدید، backend باید این header ها را اضافه کند:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### خطای Network
1. بررسی کنید backend در حال اجرا باشد
2. URL در `.env` را چک کنید
3. از DevTools → Network تب استفاده کنید

### توکن ذخیره نمی‌شود
1. localStorage را در مرورگر چک کنید
2. مطمئن شوید `setAuthToken` صدا زده شده
3. Console را برای خطاها بررسی کنید

## 💡 نکات مهم

1. **همیشه از Hook ها استفاده کنید** - نه از service مستقیم
2. **Loading و Error را هندل کنید** - برای تجربه کاربری بهتر
3. **از Toast استفاده کنید** - برای نمایش پیام‌ها
4. **Validation اضافه کنید** - قبل از ارسال به سرور

## ✨ مثال کامل یک صفحه

```tsx
import { usePrescriptions } from './hooks/usePrescriptions';
import { toast } from 'sonner@2.0.3';

function MyComponent() {
  const { 
    prescriptions,      // ✅ داده‌ها از بک‌اند
    isLoading,          // ✅ وضعیت لودینگ
    error,              // ✅ خطاها
    createPrescription, // ✅ ایجاد جدید
    deletePrescription  // ✅ حذف
  } = usePrescriptions();

  // نمایش لودینگ
  if (isLoading) return <Spinner />;
  
  // نمایش خطا
  if (error) return <Error message={error} />;
  
  // نمایش داده‌ها
  return (
    <div>
      {prescriptions.map(p => (
        <PrescriptionCard 
          key={p.id} 
          data={p}
          onDelete={() => deletePrescription(p.id)}
        />
      ))}
    </div>
  );
}
```

---

**همه چیز آماده است! فقط backend خود را متصل کنید** 🎉

برای سوالات بیشتر، به فایل `/examples/API_USAGE_GUIDE.md` مراجعه کنید.
