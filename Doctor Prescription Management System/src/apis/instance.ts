

// پیکربندی اصلی API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
 
// تایپ‌های مشترک
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  doctorId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient';
  doctorId?: string;
}

// کلاس اصلی برای مدیریت API calls
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // بارگذاری توکن از localStorage در صورت وجود
    this.token = localStorage.getItem('authorization');
  }

  // تنظیم توکن احراز هویت
  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authorization', token);
    } else {
      localStorage.removeItem('authorization');
    }
  }

  // درخواست عمومی با مدیریت خطا
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // const headers: HeadersInit = {
      //   'Content-Type': 'application/json',
      //   ...options.headers,
      // };

      // اضافه کردن توکن احراز هویت
      // if (this.token) {
      //   headers['Authorization'] = `Bearer ${this.token}`;
      // }
      const headers = new Headers({
        "Content-Type": "application/json",
        ...(options.headers || {})
      });

      if (this.token) {
        headers.set("Authorization", `${this.token}`);
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'خطایی رخ داده است',
        };
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'خطای شبکه',
      };
    }
  }

  // متدهای عمومی HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }


  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // API endpoints مربوط به احراز هویت
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.post<{ user: User; token: string }>('/auth/login', credentials);
    if (response.success && response.data) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.post<{ user: User; token: string }>('/auth/register', data);
    if (response.success && response.data) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.setAuthToken(null);
    await this.post('/auth/logout', {});
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/auth/me');
  }

}

// اینستنس singleton از ApiService
export const apiService = new ApiService(API_BASE_URL);
