import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  error: null,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user is already authenticated
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      const res = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (res.data.status === 'success') {
        setUser(res.data.data.user);
      }
    } catch (error) {
      // Token might be expired, clear it
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.status === 'success') {
        localStorage.setItem('accessToken', res.data.data.accessToken);
        setUser(res.data.data.user);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred during login'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });
      
      if (res.data.status === 'success') {
        // Auto login after registration
        await login(email, password);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred during registration'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    
    // Call the logout endpoint to invalidate the token on the server
    axios.post('/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }).catch(() => {
      // Ignore errors during logout
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 