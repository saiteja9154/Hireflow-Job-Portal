import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password, role) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData, role) => {
    setLoading(true);
    try {
      // Structure registration request according to role
      const payload = {
        email: userData.email,
        password: userData.password,
        name: role === 'candidate' ? userData.fullName : userData.recruiterName,
        role: role,
        company_name: role === 'recruiter' ? userData.companyName : null,
        // Add extra fields if required
        phone: userData.phone || '',
        skills: userData.skills || '',
        location: userData.location || '',
        experience: userData.experience || '',
        summary: userData.summary || ''
      };
      
      const response = await api.post('/auth/register', payload);
      // Automatically log in after registration
      return await login(userData.email, userData.password, role);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/profile', profileData);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
