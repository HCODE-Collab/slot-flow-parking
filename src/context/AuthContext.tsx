
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, Role } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // On initial load, check for token and user in localStorage
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

  // Save token and user to localStorage whenever they change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  // Mock login function - would be replaced with actual API call
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API request
      // In a real app, you'd make a fetch/axios request to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user and token - would come from the API response
      const mockUser: User = {
        id: 1,
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
      };
      
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      toast({
        title: "Login successful!",
        description: `Welcome back, ${mockUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function - would be replaced with actual API call
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Mock API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user and token
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        role: 'USER',
      };
      
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
      
      setUser(mockUser);
      setToken(mockToken);
      setIsAuthenticated(true);
      toast({
        title: "Registration successful!",
        description: `Welcome, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive",
      });
      throw error;
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
      description: "You have been logged out successfully."
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
