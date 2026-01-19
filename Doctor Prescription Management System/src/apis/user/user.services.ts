import { IResponse } from '../../lib/types/base';
import { IGetUserProfile, IResOfLogin, IUser } from './user.types';
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
  // admin role
  async getDoctors() {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTU5ZTg2NjhmNTljNzU2NmQ0NDU2YjciLCJyb2xlIjoidXNlciIsImlhdCI6MTc2NzUzNTkyMSwiZXhwIjoxNzY3NTM5NTIxfQ.1bzwABmGbw9_SgstL_-OJpu-b_-m9f1PSST1VtQNGrw")
    return apiService.get<IResponse<{doctors:IUser[],total_doctor:number,total_petition:number}>>('/admin/list/1/10?feild=role&word=doctor');
  }


  // all roles
  async getUser(): Promise<ApiResponse<IResponse<IGetUserProfile>>> {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNkNTY1ODE4ZjU5YzJjNzQ4MGFhMWEiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NzA0Mzk1LCJleHAiOjE3Njc3MDc5OTV9.ZaP5dG4miF6RpjapjSqCqOqTqoUE9o6fmvlqM_-eiZk")
    return apiService.get<IResponse<IGetUserProfile>>(`/users/byId`);
  }

  // ساخت یوزر جدید
  async createUser(data: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>> {
    return apiService.post<CreateUserResponse>(`/users/create`,data);
  }

  // admin role
  async createDoctor(data: CreateDoctorRequest): Promise<ApiResponse<Doctor>> {
    return apiService.post<Doctor>('/users/doctors', data);
  }

  // ویرایش کاربر
  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiService.put<User>(`/users/${userId}`, data);
  }

  // حذف کاربر
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNlNzEyZTAyNDEzNDZhNzQzOTRiY2MiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3Njc0ODM3LCJleHAiOjE3Njc2Nzg0Mzd9.Zyn9W5pk6cC0faGmQwVqS6E7B7xmrbZltsUcZLKYL30")
    return apiService.delete<void>(`/admin/delete/${userId}`);
  }

  async getListDoctors() {
    return apiService.get<IResponse<{doctors:Doctor[]}>>(`/users/doctors`);
  }


  async getProfileDoctor() {
    //apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNkNTY1ODE4ZjU5YzJjNzQ4MGFhMWEiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY4MTI2OTU3LCJleHAiOjE3NjgxMzA1NTd9.aXB_fK54I-xlPYFOUNzoPstDhbSHxMMvDaTdrzLZ-RQ")
    return apiService.get<IResponse<{doctor:Doctor,patients:Patient[]}>>(`/users/doctor/profile`);
  }

  async Login(username: string, password: string) {
    const res = await apiService.post<IResponse<IResOfLogin>>(`/users/login`,{username,password});
    apiService.setAuthToken(res.data?.data.token || "")
    return res
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
