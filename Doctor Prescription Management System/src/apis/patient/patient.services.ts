import { IResponse } from '../../lib/types/base';
import { apiService, ApiResponse, User } from '../instance';
import { Patient,CreatePatientRequest } from './patient.types';

class PatientService {

  // دریافت لیست بیماران (برای دکتر یا ادمین)
  async getPatients(doctorId?: string): Promise<ApiResponse<Patient[]>> {
    apiService.setAuthToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTNlNzEyZTAyNDEzNDZhNzQzOTRiY2MiLCJyb2xlIjoiZG9jdG9yIiwiaWF0IjoxNzY3NDk5NDM3LCJleHAiOjE3Njc1MDMwMzd9.-48Z7oMCYhWAAEEqyPFYm4bk-cFPiFzwUtCcF6mlFwE")
    const endpoint = doctorId 
      ? `/users/patients?doctorId=${doctorId}`
      : '/users/patients';
    return apiService.get<Patient[]>(endpoint);
  }

  // دریافت بیماران یک دکتر خاص
  async getDoctorPatients(doctorId: string): Promise<ApiResponse<Patient[]>> {
    return apiService.get<Patient[]>(`/users/doctors/${doctorId}/patients`);
  }


    // ایجاد بیمار جدید
  async createPatient(data: CreatePatientRequest): Promise<ApiResponse<Patient>> {
    return apiService.post<Patient>('/task/create', data);
  }
}