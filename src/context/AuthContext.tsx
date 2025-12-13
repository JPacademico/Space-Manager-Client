import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    // 1. LAZY INITIALIZATION
    // We pass a function to useState. React runs this ONLY once on startup.
    const [user, setUser] = useState<User | null>(() => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
  
      if (token && savedUser) {
        // If we find data, we configure the API immediately
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // And return the user as the initial state
        return JSON.parse(savedUser);
      }
      
      return null; // Default state if nothing found
    });
  
    // 2. We don't need the useEffect anymore! 
    // Because the state is already correct from the very first moment.
  
    const login = (token: string, userData: User) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
    };
  
    const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
        {children}
      </AuthContext.Provider>
    );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);