import { apiService, ApiResponse } from './instance';

// تایپ‌های مربوط به نسخه
export interface Prescription {
  id: string;
  disease: string;
  medicines: string[];
  instructions: string;
  date: string;
  doctorName: string;
  patientId: string;
  doctorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePrescriptionRequest {
  patientId: string;
  disease: string;
  medicines: string[];
  instructions: string;
}

export interface UpdatePrescriptionRequest {
  disease?: string;
  medicines?: string[];
  instructions?: string;
}

// سرویس مدیریت نسخه‌ها
class PrescriptionService {
  // دریافت تمام نسخه‌های بیمار
  async getPatientPrescriptions(patientId?: string): Promise<ApiResponse<Prescription[]>> {
    const endpoint = patientId 
      ? `/prescriptions/patient/${patientId}`
      : '/prescriptions/my';
    return apiService.get<Prescription[]>(endpoint);
  }

  // دریافت نسخه‌های دکتر
  async getDoctorPrescriptions(): Promise<ApiResponse<Prescription[]>> {
    return apiService.get<Prescription[]>('/prescriptions/doctor');
  }

  // دریافت تمام نسخه‌ها (برای ادمین)
  async getAllPrescriptions(): Promise<ApiResponse<Prescription[]>> {
    return apiService.get<Prescription[]>('/prescriptions');
  }

  // دریافت یک نسخه خاص
  async getPrescription(id: string): Promise<ApiResponse<Prescription>> {
    return apiService.get<Prescription>(`/prescriptions/${id}`);
  }

  // ایجاد نسخه جدید (برای دکتر)
  async createPrescription(data: CreatePrescriptionRequest): Promise<ApiResponse<Prescription>> {
    return apiService.post<Prescription>('/prescriptions', data);
  }

  // ویرایش نسخه
  async updatePrescription(
    id: string,
    data: UpdatePrescriptionRequest
  ): Promise<ApiResponse<Prescription>> {
    return apiService.put<Prescription>(`/prescriptions/${id}`, data);
  }

  // حذف نسخه
  async deletePrescription(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<void>(`/prescriptions/${id}`);
  }
}

export const prescriptionService = new PrescriptionService();
