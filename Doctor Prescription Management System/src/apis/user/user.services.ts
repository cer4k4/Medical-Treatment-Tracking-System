import { IResponse } from '../../lib/types/base';
import { IGetUserProfile, IUser } from './user.types';
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
  specialty?: string;
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
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzUzNTkyMSwiZXhwIjoxNzY3NTM5NTIxfQ.1bzwABmGbw9_SgstL_-OJpu-b_-m9f1PSST1VtQNGrw")
    return apiService.get<IResponse<{doctors:IUser[],total_doctor:number,total_petition:number}>>('/admin/list/1/10?feild=role&word=doctor');
  }


  // دریافت اطلاعات یک کاربر
  async getUser(): Promise<ApiResponse<IGetUserProfile>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzUzNTkyMSwiZXhwIjoxNzY3NTM5NTIxfQ.1bzwABmGbw9_SgstL_-OJpu-b_-m9f1PSST1VtQNGrw")
    return apiService.get<IGetUserProfile>(`/users/byId`);
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
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ1ZGRjOGM1MDczYzRkODJlNmUzZjQiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NTYwNzUwLCJleHAiOjE3Njc1NjQzNTB9.OBBjbr6uW0YRVQ-wDbSKbAifalZux8i1x-47Kweq4m0")
    return apiService.delete<void>(`/admin/delete/${userId}`);
  }

  async getListDoctors() {
    return apiService.get<IResponse<{doctors:Doctor[]}>>(`/users/doctors`);
  }


  async getProfileDoctor() {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ1ZGRjOGM1MDczYzRkODJlNmUzZjQiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NTYwNzUwLCJleHAiOjE3Njc1NjQzNTB9.OBBjbr6uW0YRVQ-wDbSKbAifalZux8i1x-47Kweq4m0")
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
