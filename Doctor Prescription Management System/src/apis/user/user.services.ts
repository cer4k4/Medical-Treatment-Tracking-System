import { IResponse } from '../../lib/types/base';
import { IUser } from './user.types';
import { apiService, ApiResponse, User } from '../instance';
export interface Patient {
  _id: string;
  username: string;
  fullName: string;
  role: 'user';
  phoneNumber?: string;
  patient?: string;   // اطلاعات بیماری / نوع بیمار
  doctor: string;     // id دکتر (string)
  specialty?: string;
  createdAt?: number;
  updatedAt?: number;
}
// تایپ‌های مربوط به کاربران
export interface Doctor {
  _id?: string;
  name?: string;
  email?: string;
  specialty?: string; 
  phoneNumber?: string;
  patientsCount?: number;
  username?:string;
  fullName?:string;
  role?: string;
  patient?: string;
  patients?: Patient[];
  doctor?: string;
  // "createdAt": 1766186440207,
  // "updatedAt": 1766186440207
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


export interface CreateDoctorRequest {
  name: string;
  email: string;
  password: string;
  specialty?: string;
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
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNmMmQxNGRjNjVlMjE4ZTQxOWFkZWUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjYxODk1MzksImV4cCI6MTc2NjE5MzEzOX0.mAfUIONUHMfv9DA8y6sMEC7aASyJsARdb2tgFbCYG_Y")
    return apiService.get<IResponse<{doctors:IUser[],total_doctor:number,total_petition:number}>>('/admin/list/1/10?feild=role&word=doctor');
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

  // ویرایش کاربر
  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiService.put<User>(`/users/${userId}`, data);
  }

  // حذف کاربر
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNmMmQxNGRjNjVlMjE4ZTQxOWFkZWUiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjYxODk1MzksImV4cCI6MTc2NjE5MzEzOX0.mAfUIONUHMfv9DA8y6sMEC7aASyJsARdb2tgFbCYG_Y")
    return apiService.delete<void>(`/admin/delete/${userId}`);
  }

  async getListDoctors() {
    return apiService.get<IResponse<{doctors:Doctor[]}>>(`/users/doctors`);
  }


  async getProfileDoctor() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ1ZGRjOGM1MDczYzRkODJlNmUzZjQiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY2NzkyNzY0LCJleHAiOjE3NjY3OTYzNjR9.vH79o5rQS1hiRWneuQfdykANpMj9VrgUpDRa7BX-67Y")
    return apiService.get<IResponse<{doctor:Doctor,patients:Patient[]}>>(`/users/doctor/profile`);
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
