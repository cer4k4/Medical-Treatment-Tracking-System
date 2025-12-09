import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, doctorId?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // بارگذاری اطلاعات کاربر هنگام بارگذاری اولیه
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const response = await apiService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // توکن نامعتبر است، پاک کنید
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'ورود ناموفق بود' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'خطا در برقراری ارتباط با سرور' 
      };
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    doctorId?: string
  ) => {
    try {
      const response = await apiService.register({ 
        name, 
        email, 
        password, 
        doctorId 
      });
      
      if (response.success && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'ثبت‌نام ناموفق بود' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'خطا در برقراری ارتباط با سرور' 
      };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        register, 
        logout, 
        updateUser 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook برای استفاده از AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  return context;
}
