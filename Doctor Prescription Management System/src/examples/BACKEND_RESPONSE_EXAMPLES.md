# 📡 نمونه پاسخ‌های Backend

این فایل نمونه‌ای از پاسخ‌هایی که backend باید برگرداند را نشان می‌دهد.

## 🔐 Authentication Endpoints

### POST /api/auth/login
**Request:**
```json
{
  "email": "doctor@clinic.com",
  "password": "password123"
}
```

**Response (موفق):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "name": "دکتر احمدی",
      "email": "doctor@clinic.com",
      "role": "doctor"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (خطا):**
```json
{
  "success": false,
  "error": "ایمیل یا رمز عبور اشتباه است"
}
```

---

### POST /api/auth/register
**Request:**
```json
{
  "name": "علی محمدی",
  "email": "ali@example.com",
  "password": "password123",
  "doctorId": "456"
}
```

**Response (موفق):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "789",
      "name": "علی محمدی",
      "email": "ali@example.com",
      "role": "patient",
      "doctorId": "456"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### GET /api/auth/me
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "دکتر احمدی",
    "email": "doctor@clinic.com",
    "role": "doctor",
    "specialty": "قلب و عروق",
    "phone": "09123456789"
  }
}
```

---

## 💊 Prescription Endpoints

### GET /api/prescriptions/my
برای بیمار - دریافت نسخه‌های خودش

**Headers:**
```
Authorization: Bearer [patient-token]
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "patientId": "789",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "disease": "فشار خون",
      "medicines": [
        "لوزارتان 50mg",
        "آسپرین 80mg"
      ],
      "instructions": "یک قرص صبح و یک قرص شب همراه با غذا",
      "date": "1403/09/15",
      "createdAt": "2024-12-05T10:30:00Z",
      "updatedAt": "2024-12-05T10:30:00Z"
    },
    {
      "id": "p2",
      "patientId": "789",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "disease": "سردرد میگرنی",
      "medicines": [
        "ایبوپروفن 400mg"
      ],
      "instructions": "در صورت شروع سردرد مصرف کنید",
      "date": "1403/09/10",
      "createdAt": "2024-12-01T14:20:00Z",
      "updatedAt": "2024-12-01T14:20:00Z"
    }
  ]
}
```

---

### GET /api/prescriptions/patient/:patientId
برای دکتر یا ادمین - دریافت نسخه‌های یک بیمار خاص

**Headers:**
```
Authorization: Bearer [doctor-or-admin-token]
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "patientId": "789",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "disease": "فشار خون",
      "medicines": ["لوزارتان 50mg"],
      "instructions": "یک قرص در روز",
      "date": "1403/09/15",
      "createdAt": "2024-12-05T10:30:00Z"
    }
  ]
}
```

---

### GET /api/prescriptions/doctor
برای دکتر - تمام نسخه‌هایی که نوشته

**Headers:**
```
Authorization: Bearer [doctor-token]
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p1",
      "patientId": "789",
      "patientName": "علی محمدی",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "disease": "فشار خون",
      "medicines": ["لوزارتان 50mg"],
      "instructions": "یک قرص در روز",
      "date": "1403/09/15",
      "createdAt": "2024-12-05T10:30:00Z"
    },
    {
      "id": "p3",
      "patientId": "890",
      "patientName": "زهرا کریمی",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "disease": "دیابت",
      "medicines": ["متفورمین 500mg"],
      "instructions": "دو بار در روز",
      "date": "1403/09/14",
      "createdAt": "2024-12-04T09:15:00Z"
    }
  ]
}
```

---

### POST /api/prescriptions
ایجاد نسخه جدید (فقط دکتر)

**Request:**
```json
{
  "patientId": "789",
  "disease": "آلرژی فصلی",
  "medicines": [
    "سترزین 10mg",
    "فلوتیکازون اسپری"
  ],
  "instructions": "سترزین یک قرص شب، اسپری دو بار در روز"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "p5",
    "patientId": "789",
    "doctorId": "123",
    "doctorName": "دکتر احمدی",
    "disease": "آلرژی فصلی",
    "medicines": [
      "سترزین 10mg",
      "فلوتیکازون اسپری"
    ],
    "instructions": "سترزین یک قرص شب، اسپری دو بار در روز",
    "date": "1403/09/18",
    "createdAt": "2024-12-09T11:45:00Z",
    "updatedAt": "2024-12-09T11:45:00Z"
  }
}
```

---

### PUT /api/prescriptions/:id
ویرایش نسخه

**Request:**
```json
{
  "instructions": "دستورالعمل جدید: یک قرص صبح ناشتا"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "p1",
    "patientId": "789",
    "doctorId": "123",
    "disease": "فشار خون",
    "medicines": ["لوزارتان 50mg"],
    "instructions": "دستورالعمل جدید: یک قرص صبح ناشتا",
    "date": "1403/09/15",
    "updatedAt": "2024-12-09T12:00:00Z"
  }
}
```

---

### DELETE /api/prescriptions/:id
حذف نسخه

**Response:**
```json
{
  "success": true,
  "message": "نسخه با موفقیت حذف شد"
}
```

---

## 👥 User Management Endpoints

### GET /api/users/doctors
دریافت لیست دکترها

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "name": "دکتر احمدی",
      "email": "ahmadi@clinic.com",
      "specialty": "قلب و عروق",
      "phone": "09123456789",
      "patientsCount": 15
    },
    {
      "id": "456",
      "name": "دکتر رضایی",
      "email": "rezaei@clinic.com",
      "specialty": "داخلی",
      "phone": "09121234567",
      "patientsCount": 22
    }
  ]
}
```

---

### GET /api/users/patients
دریافت لیست بیماران (برای دکتر یا ادمین)

**Query Parameters:**
- `doctorId` (optional): فیلتر بر اساس دکتر

**Request:**
```
GET /api/users/patients?doctorId=123
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "789",
      "name": "علی محمدی",
      "email": "ali@example.com",
      "phone": "09187654321",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "prescriptionsCount": 3
    },
    {
      "id": "890",
      "name": "زهرا کریمی",
      "email": "zahra@example.com",
      "phone": "09181234567",
      "doctorId": "123",
      "doctorName": "دکتر احمدی",
      "prescriptionsCount": 5
    }
  ]
}
```

---

### GET /api/users/doctors/:doctorId/patients
دریافت بیماران یک دکتر خاص

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "789",
      "name": "علی محمدی",
      "email": "ali@example.com",
      "phone": "09187654321",
      "prescriptionsCount": 3
    }
  ]
}
```

---

### POST /api/users/doctors
ایجاد دکتر جدید (فقط ادمین)

**Request:**
```json
{
  "name": "دکتر نوری",
  "email": "noori@clinic.com",
  "password": "secure123",
  "specialty": "اطفال",
  "phone": "09129876543"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "999",
    "name": "دکتر نوری",
    "email": "noori@clinic.com",
    "specialty": "اطفال",
    "phone": "09129876543",
    "patientsCount": 0
  }
}
```

---

### POST /api/users/patients
ایجاد بیمار جدید

**Request:**
```json
{
  "name": "حسن کاظمی",
  "email": "hassan@example.com",
  "password": "pass456",
  "doctorId": "123",
  "phone": "09191234567"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1000",
    "name": "حسن کاظمی",
    "email": "hassan@example.com",
    "doctorId": "123",
    "phone": "09191234567",
    "prescriptionsCount": 0
  }
}
```

---

### PUT /api/users/:userId
ویرایش اطلاعات کاربر

**Request:**
```json
{
  "name": "دکتر احمدی (به‌روز شده)",
  "phone": "09121111111",
  "specialty": "قلب و عروق و فشار خون"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "دکتر احمدی (به‌روز شده)",
    "email": "ahmadi@clinic.com",
    "role": "doctor",
    "specialty": "قلب و عروق و فشار خون",
    "phone": "09121111111"
  }
}
```

---

### DELETE /api/users/:userId
حذف کاربر

**Response:**
```json
{
  "success": true,
  "message": "کاربر با موفقیت حذف شد"
}
```

---

## ❌ نمونه پاسخ‌های خطا

### 400 Bad Request
```json
{
  "success": false,
  "error": "ایمیل وارد شده معتبر نیست"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "لطفاً ابتدا وارد شوید"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "شما اجازه دسترسی به این منبع را ندارید"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "نسخه مورد نظر یافت نشد"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "خطای سرور. لطفاً بعداً تلاش کنید"
}
```

---

## 📝 نکات مهم

### 1. فرمت ثابت پاسخ
همه endpoint‌ها باید این فرمت را رعایت کنند:
```typescript
{
  success: boolean,
  data?: any,      // در صورت موفقیت
  error?: string,  // در صورت خطا
  message?: string // پیام اختیاری
}
```

### 2. Authentication
تمام endpoint‌ها (به جز login/register) باید `Authorization` header را چک کنند:
```
Authorization: Bearer [JWT-TOKEN]
```

### 3. تاریخ‌ها
- تاریخ‌های فارسی در فیلد `date` (مثل: `1403/09/15`)
- تاریخ‌های ISO در `createdAt` و `updatedAt`

### 4. Validation
Backend باید validation انجام دهد:
- بررسی وجود فیلدهای ضروری
- بررسی فرمت ایمیل
- بررسی قدرت رمز عبور
- بررسی دسترسی کاربر (authorization)

### 5. پاسخ‌های فارسی
تمام پیام‌های خطا و موفقیت باید به فارسی باشند.

---

## 🧪 تست با Postman

برای تست API ها می‌توانید از Postman استفاده کنید:

1. Import collection
2. Set environment variable: `{{baseUrl}}` = `http://localhost:4000/api`
3. After login, save token in environment
4. Use `{{token}}` in Authorization header

---

با پیاده‌سازی این endpoint‌ها، پروژه frontend شما کاملاً کار خواهد کرد! 🚀
