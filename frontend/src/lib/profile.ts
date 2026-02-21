import api from './axios';
import { User } from '@/types';

export const profileService = {
  get: async (): Promise<User> => {
    const res = await api.get<{ user: User }>('/profile');
    return res.data.user;
  },

  update: async (data: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>): Promise<User> => {
    const res = await api.put<{ user: User }>('/profile', data);
    return res.data.user;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put('/profile/password', data);
  },
};
