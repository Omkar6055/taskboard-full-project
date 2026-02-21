export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: Pagination;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
