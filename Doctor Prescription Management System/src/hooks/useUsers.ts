import { useState, useEffect } from 'react';
import { 
  userService, 
  Doctor, 
  Patient, 
  CreateDoctorRequest,
  CreatePatientRequest,
  UpdateUserRequest
} from '../services/userService';

// Hook برای مدیریت دکترها
export function useDoctors(autoFetch: boolean = true) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getDoctors();
      
      if (response.success && response.data) {
        setDoctors(response.data);
      } else {
        setError(response.error || 'خطا در بارگذاری لیست پزشکان');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const createDoctor = async (data: CreateDoctorRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.createDoctor(data);
      
      if (response.success && response.data) {
        setDoctors(prev => [...prev, response.data!]);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ایجاد پزشک');
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

  const updateDoctor = async (doctorId: string, data: UpdateUserRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.updateUser(doctorId, data);
      
      if (response.success && response.data) {
        setDoctors(prev => 
          prev.map(d => d.id === doctorId ? { ...d, ...data } : d)
        );
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ویرایش پزشک');
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

  const deleteDoctor = async (doctorId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.deleteUser(doctorId);
      
      if (response.success) {
        setDoctors(prev => prev.filter(d => d.id !== doctorId));
        return { success: true };
      } else {
        setError(response.error || 'خطا در حذف پزشک');
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

  useEffect(() => {
    if (autoFetch) {
      fetchDoctors();
    }
  }, [autoFetch]);

  return {
    doctors,
    isLoading,
    error,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
}

// Hook برای مدیریت بیماران
export function usePatients(doctorId?: string, autoFetch: boolean = true) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getPatients(doctorId);
      
      if (response.success && response.data) {
        setPatients(response.data);
      } else {
        setError(response.error || 'خطا در بارگذاری لیست بیماران');
      }
    } catch (err) {
      setError('خطا در برقراری ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  const createPatient = async (data: CreatePatientRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.createPatient(data);
      
      if (response.success && response.data) {
        setPatients(prev => [...prev, response.data!]);
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ایجاد بیمار');
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

  const updatePatient = async (patientId: string, data: UpdateUserRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.updateUser(patientId, data);
      
      if (response.success && response.data) {
        setPatients(prev => 
          prev.map(p => p.id === patientId ? { ...p, ...data } : p)
        );
        return { success: true, data: response.data };
      } else {
        setError(response.error || 'خطا در ویرایش بیمار');
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

  const deletePatient = async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.deleteUser(patientId);
      
      if (response.success) {
        setPatients(prev => prev.filter(p => p.id !== patientId));
        return { success: true };
      } else {
        setError(response.error || 'خطا در حذف بیمار');
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

  useEffect(() => {
    if (autoFetch) {
      fetchPatients();
    }
  }, [doctorId, autoFetch]);

  return {
    patients,
    isLoading,
    error,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}
