import { IResponse } from '../../lib/types/base';
import { IUser } from './user.types';
import { apiService, ApiResponse, User } from '../instance';

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
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTIxNzU5YmY0ZTlmNTkzMDg1OTUzMjciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjU3MDQwNDEsImV4cCI6MTc2NTcwNzY0MX0.t1Hsiel2xe8VRk0fDJ4AH3Htj3dcv0PK_U0BmF8cdO8")
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
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTIxNzU5YmY0ZTlmNTkzMDg1OTUzMjciLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjU3MDQwNDEsImV4cCI6MTc2NTcwNzY0MX0.t1Hsiel2xe8VRk0fDJ4AH3Htj3dcv0PK_U0BmF8cdO8")
    return apiService.delete<void>(`/admin/delete/${userId}`);
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
