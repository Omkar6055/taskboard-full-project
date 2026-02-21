import Cookies from 'js-cookie';
import api from './axios';
import { AuthResponse, User } from '@/types';

const TOKEN_KEY = 'token';

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'Lax' });
};

export const getToken = () => Cookies.get(TOKEN_KEY);

export const removeToken = () => Cookies.remove(TOKEN_KEY);

export const isAuthenticated = () => !!getToken();

export const authService = {
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    setToken(res.data.token);
    return res.data;
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    setToken(res.data.token);
    return res.data;
  },

  logout: () => {
    removeToken();
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ user: User }>('/auth/me');
    return res.data.user;
  },
};
