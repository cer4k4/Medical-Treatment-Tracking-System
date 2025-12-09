import { useState, useEffect } from 'react';
import { 
  prescriptionService, 
  Prescription, 
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest 
} from '../services/prescriptionService';

interface UsePrescriptionsOptions {
  patientId?: string;
  autoFetch?: boolean;
}

export function usePrescriptions(options: UsePrescriptionsOptions = {}) {
  const { patientId, autoFetch = true } = options;
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // بارگذاری نسخه‌ها
  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionService.getPatientPrescriptions(patientId);
      
      if (response.success && response.data) {
        setPrescriptions(response.data);
      } else {
        setError(response.error || 'خطا در بارگذاری نسخه‌ها');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  // ایجاد نسخه جدید
  const createPrescription = async (data: CreatePrescriptionRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionService.createPrescription(data);
      
      if (response.success && response.data) {
        setPrescriptions(prev => [response.data!, ...prev]);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ایجاد نسخه');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = 'خطا در برقراری ارتباط با سرور';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // ویرایش نسخه
  const updatePrescription = async (id: string, data: UpdatePrescriptionRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionService.updatePrescription(id, data);
      
      if (response.success && response.data) {
        setPrescriptions(prev => 
          prev.map(p => p.id === id ? response.data! : p)
        );
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ویرایش نسخه');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = 'خطا در برقراری ارتباط با سرور';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // حذف نسخه
  const deletePrescription = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionService.deletePrescription(id);
      
      if (response.success) {
        setPrescriptions(prev => prev.filter(p => p.id !== id));
        return { success: true };
      } else {
        setError(response.error || 'خطا در حذف نسخه');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = 'خطا در برقراری ارتباط با سرور';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // بارگذاری خودکار در صورت فعال بودن
  useEffect(() => {
    if (autoFetch) {
      fetchPrescriptions();
    }
  }, [patientId, autoFetch]);

  return {
    prescriptions,
    isLoading,
    error,
    fetchPrescriptions,
    createPrescription,
    updatePrescription,
    deletePrescription,
  };
}

// Hook برای دریافت نسخه‌های دکتر
export function useDoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await prescriptionService.getDoctorPrescriptions();
      
      if (response.success && response.data) {
        setPrescriptions(response.data);
      } else {
        setError(response.error || 'خطا در بارگذاری نسخه‌ها');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return {
    prescriptions,
    isLoading,
    error,
    fetchPrescriptions,
  };
}
