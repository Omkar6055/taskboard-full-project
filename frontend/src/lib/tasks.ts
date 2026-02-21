import api from './axios';
import { Task, TasksResponse } from '@/types';

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string | null;
}

export const taskService = {
  getAll: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await api.get<TasksResponse>(`/tasks?${params}`);
    return res.data;
  },

  getOne: async (id: string): Promise<Task> => {
    const res = await api.get<{ task: Task }>(`/tasks/${id}`);
    return res.data.task;
  },

  create: async (data: TaskPayload): Promise<Task> => {
    const res = await api.post<{ task: Task }>('/tasks', data);
    return res.data.task;
  },

  update: async (id: string, data: Partial<TaskPayload>): Promise<Task> => {
    const res = await api.put<{ task: Task }>(`/tasks/${id}`, data);
    return res.data.task;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
