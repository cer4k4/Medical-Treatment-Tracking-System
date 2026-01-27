import { IResponse } from '../../lib/types/base';
import { apiService, ApiResponse, User } from '../instance';
import { Patient,CreatePatientRequest } from './patient.types';

class PatientService {
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


// doctor role
  async createPatient(data: CreatePatientRequest): Promise<ApiResponse<Patient>> {
    return apiService.post<Patient>('/task/create', data);
  }
}