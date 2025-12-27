import { IResponse } from '../lib/types/base';
import { IUser } from '../apis/user/user';
import { apiService, ApiResponse, User } from './api';

// تایپ‌های مربوط به کاربران
export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty?: string; 
  phone?: string;
  patientsCount?: number;
}

export interface CreateUserResponse {
  successfully: boolean;
  data: any;
  statusCode: number;
  message: string;
}


export interface CreateUserRequest {
  username: string;
  fullName: string;
  role: string;
  doctor: string;
  patient: string;
  password: string;
  specialty: string;
  phoneNumber: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  doctorId: string;
  doctorName?: string;
  prescriptionsCount?: number;
}

export interface CreateDoctorRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  phone?: string;
}

export interface CreatePatientRequest {
  name: string;
  email: string;
  password: string;
  doctorId: string;
  phone?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  specialty?: string;
  phone?: string;
}

// سرویس مدیریت کاربران
class UserService {
  // دریافت لیست دکترها
  async getDoctors() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNmMmQxNGRjNjVlMjE4ZTQxOWFkZWUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjYxODQ0ODMsImV4cCI6MTc2NjE4ODA4M30.BCaM7Ys0bCFv5biPEVPHAyikyr7ZMfNzZm5bK2ANEXI")
    return apiService.get<IResponse<IUser[]>>('/admin/list/1/10?feild=role&word=doctor');
  }

  // دریافت لیست بیماران (برای دکتر یا ادمین)
  async getPatients(doctorId?: string): Promise<ApiResponse<Patient[]>> {
    const endpoint = doctorId 
      ? `/users/patients?doctorId=${doctorId}`
      : '/users/patients';
    return apiService.get<Patient[]>(endpoint);
  }

  // دریافت بیماران یک دکتر خاص
  async getDoctorPatients(doctorId: string): Promise<ApiResponse<Patient[]>> {
    return apiService.get<Patient[]>(`/users/doctors/${doctorId}/patients`);
  }

  // دریافت اطلاعات یک کاربر
  async getUser(userId: string): Promise<ApiResponse<User>> {
    return apiService.get<User>(`/users/${userId}`);
  }

  // ساخت یوزر جدید
  async createUser(data: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    return apiService.post<CreateUserResponse>(`/users/create`,data);
  }

  // ایجاد دکتر جدید (فقط ادمین)
  async createDoctor(data: CreateDoctorRequest): Promise<ApiResponse<Doctor>> {
    return apiService.post<Doctor>('/users/doctors', data);
  }

  // ایجاد بیمار جدید
  async createPatient(data: CreatePatientRequest): Promise<ApiResponse<Patient>> {
    return apiService.post<Patient>('/users/patients', data);
  }

  // ویرایش کاربر
  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiService.put<User>(`/users/${userId}`, data);
  }

  // حذف کاربر
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/users/${userId}`);
  }

  // تغییر رمز عبور
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiService.put<void>('/users/change-password', {
      oldPassword,
      newPassword,
    });
  }
}

export const userService = new UserService();
