import { createContext, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    token: localStorage.getItem('token') || null,
    role: null,
    user: null,
    students: null,
    error: null,
    success: null,
    loading: false,
  });

  const navigate = useNavigate();
  const API = axios.create({ baseURL: 'https://edu-track-snowy.vercel.app/api' });

  const updateState = useCallback((newState) => {
    setState((prev) => ({ ...prev, ...newState }));
  }, []);

  const signup = async (data) => {
    updateState({ loading: true, error: null, success: null });
    try {
      await API.post('/auth/signup', data);
      updateState({ success: 'Signup successful, please verify your email', loading: false });
    } catch (err) {
      console.error('Signup error:', err.message, err.response?.data);
      updateState({
        error: err.response?.data?.msg || 'Failed to connect to server. Please check if the backend is running.',
        loading: false,
      });
    }
  };

  const login = async (data) => {
    updateState({ loading: true, error: null, success: null });
    try {
      const res = await API.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      updateState({
        token: res.data.token,
        role: res.data.role,
        success: 'Login successful',
        loading: false,
      });
      navigate(res.data.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Login error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Login failed', loading: false });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    updateState({ token: null, role: null, user: null, students: null, success: 'Logged out' });
    navigate('/login');
    setTimeout(() => updateState({ success: null }), 3000);
  };

  const clearMessages = useCallback(() => updateState({ error: null, success: null }), [updateState]);

  const getProfile = useCallback(async () => {
    if (state.user || !state.token) return;
    updateState({ loading: true });
    try {
      const res = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ user: res.data, loading: false });
    } catch (err) {
      console.error('Get profile error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to fetch profile', loading: false });
    }
  }, [state.user, state.token, updateState]);

  const updateProfile = async (data) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return;
    }
    updateState({ loading: true, error: null, success: null });
    try {
      const res = await API.put('/users/profile', data, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ user: res.data, success: 'Profile updated', loading: false });
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Update profile error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to update profile', loading: false });
    }
  };

  const getStudents = useCallback(async (page = 1, limit = 10) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return null;
    }
    updateState({ loading: true, error: null });
    try {
      const res = await API.get(`/users/students?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ students: res.data.students, loading: false });
      return res.data;
    } catch (err) {
      console.error('Get students error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to fetch students', loading: false });
      return null;
    }
  }, [state.token, updateState]);

  const addStudent = async (data) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return;
    }
    updateState({ loading: true, error: null, success: null });
    try {
      await API.post('/users/students', data, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ success: 'Student added', loading: false });
      // Fetch fresh students to update cache
      const res = await API.get('/users/students?page=1&limit=10', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ students: res.data.students });
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Add student error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to add student', loading: false });
    }
  };

  const deleteStudent = async (id) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return;
    }
    updateState({ loading: true, error: null, success: null });
    try {
      await API.delete(`/users/students/${id}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ success: 'Student deleted', loading: false });
      // Fetch fresh students to update cache
      const res = await API.get('/users/students?page=1&limit=10', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ students: res.data.students });
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Delete student error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to delete student', loading: false });
    }
  };

  const updateStudent = async (id, data) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return null;
    }
    updateState({ loading: true, error: null, success: null });
    try {
      const res = await API.put(`/users/students/${id}`, data, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ success: 'Student updated', loading: false });
      // Fetch fresh students to update cache
      const studentsRes = await API.get('/users/students?page=1&limit=10', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      updateState({ students: studentsRes.data.students });
      setTimeout(() => updateState({ success: null }), 3000);
      return res.data;
    } catch (err) {
      console.error('Update student error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to update student', loading: false });
      return null;
    }
  };

  const verifyEmail = useCallback(async (token) => {
    updateState({ loading: true, error: null, success: null });
    try {
      await API.get(`/auth/verify/${token}`);
      updateState({ success: 'Email verified successfully', loading: false });
    } catch (err) {
      console.error('Verify email error:', err.message, err.response?.data);
      updateState({
        error: err.response?.data?.msg || 'Verification failed. Please try again or request a new link.',
        loading: false,
      });
    }
  }, [updateState]);

  const forgotPassword = async (email) => {
    updateState({ loading: true, error: null, success: null });
    try {
      await API.post('/auth/forgot', { email });
      updateState({ success: 'Reset link sent to your email', loading: false });
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Forgot password error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to send reset link', loading: false });
    }
  };

  const resetPassword = async (token, password) => {
    updateState({ loading: true, error: null, success: null });
    try {
      await API.post(`/auth/reset/${token}`, { password });
      updateState({ success: 'Password reset successful', loading: false });
      navigate('/login');
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Reset password error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to reset password', loading: false });
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!state.token) {
      updateState({ error: 'No token available', loading: false });
      return;
    }
    updateState({ loading: true, error: null, success: null });
    try {
      await API.post(
        '/auth/change-password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${state.token}` } }
      );
      updateState({ success: 'Password changed successfully', loading: false });
      setTimeout(() => updateState({ success: null }), 3000);
    } catch (err) {
      console.error('Change password error:', err.message, err.response?.data);
      updateState({ error: err.response?.data?.msg || 'Failed to change password', loading: false });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signup,
        login,
        logout,
        clearMessages,
        getProfile,
        updateProfile,
        getStudents,
        addStudent,
        deleteStudent,
        updateStudent,
        verifyEmail,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};