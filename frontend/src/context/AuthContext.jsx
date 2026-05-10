import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import http from '../api/http';

const AuthContext = createContext(null);

const userKey = 'ems_user';
const tokenKey = 'ems_access_token';

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(userKey);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(tokenKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (accessToken) {
          const { data } = await http.get('/auth/me');
          setUser(data.data.user);
          localStorage.setItem(userKey, JSON.stringify(data.data.user));
          return;
        }

        const refreshResponse = await http.post('/auth/refresh');
        const nextToken = refreshResponse.data?.data?.accessToken;
        if (nextToken) {
          localStorage.setItem(tokenKey, nextToken);
          setAccessToken(nextToken);
          const meResponse = await http.get('/auth/me');
          setUser(meResponse.data.data.user);
          localStorage.setItem(userKey, JSON.stringify(meResponse.data.data.user));
        }
      } catch (error) {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [accessToken]);

  const persistSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setAccessToken(nextToken);
    localStorage.setItem(userKey, JSON.stringify(nextUser));
    localStorage.setItem(tokenKey, nextToken);
  };

  const register = async (payload) => {
    const { data } = await http.post('/auth/register', payload);
    persistSession(data.data.user, data.data.accessToken);
    toast.success('Registration successful');
    navigate('/dashboard/profile');
  };

  const login = async (payload) => {
    const { data } = await http.post('/auth/login', payload);
    persistSession(data.data.user, data.data.accessToken);
    toast.success('Welcome back');
    navigate(data.data.user.role === 'admin' ? '/admin' : '/dashboard/profile');
  };

  const loginAdmin = async (payload) => {
    const { data } = await http.post('/auth/login', payload);
    const nextUser = data.data.user;

    if (nextUser?.role !== 'admin') {
      try {
        await http.post('/auth/logout');
      } finally {
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(userKey);
        setUser(null);
        setAccessToken(null);
      }

      toast.error('Admin access required');
      navigate('/admin/login');
      return;
    }

    persistSession(nextUser, data.data.accessToken);
    toast.success('Welcome back');
    navigate('/admin');
  };

  const logout = async () => {
    try {
      await http.post('/auth/logout');
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(userKey);
      navigate('/login');
    }
  };

  const updateProfile = async (payload) => {
    const { data } = await http.put('/auth/me', payload);
    setUser(data.data.user);
    localStorage.setItem(userKey, JSON.stringify(data.data.user));
    toast.success('Profile updated');
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      loading,
      isAuthenticated: Boolean(user && accessToken),
      register,
      login,
      loginAdmin,
      logout,
      updateProfile,
      setUser,
      setAccessToken,
    }),
    [user, accessToken, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};