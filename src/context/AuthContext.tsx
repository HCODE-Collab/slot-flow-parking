import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios,{AxiosError} from 'axios';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

const BASE_URL = "http://localhost:5000/api/v1";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: "USER" | "ADMIN") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Load from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  // LOGIN
  const login = async (email: string, password: string) => {
  try {
    setIsLoading(true);

    const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    const data = res.data.data;

    setUser(data.user);
    setToken(data.token);
    setIsAuthenticated(true);

    toast({
      title: "Login successful!",
      description: `Welcome back, ${data.user.name}!`,
    });
  } catch (error) {
    let message = "Login failed";
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    toast({
      title: "Login failed",
      description: message,
      variant: "destructive",
    });

    throw new Error(message);
  } finally {
    setIsLoading(false);
  }
};

  // REGISTER
const register = async (
  name: string,
  email: string,
  password: string,
  role: "USER" | "ADMIN"
) => {
  try {
    setIsLoading(true);

    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
      role,
    });

    const data = res.data;

    setUser(data.user);
    setToken(data.token);
    setIsAuthenticated(true);

    toast({
      title: "Registration successful!",
      description: `Welcome, ${data.user.name}!`,
    });

  } catch (error) {
    let message = "Registration failed";

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }

    toast({
      title: "Registration failed",
      description: message,
      variant: "destructive",
    });

    throw new Error(message);
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
