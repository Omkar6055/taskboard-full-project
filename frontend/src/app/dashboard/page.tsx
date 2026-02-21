'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { taskService } from '@/lib/tasks';
import { Task } from '@/types';
import Link from 'next/link';

interface Stats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [recent, setRecent] = useState<Task[]>([]);

  useEffect(() => {
    const load = async () => {
      const [all, inProg, done] = await Promise.all([
        taskService.getAll({ limit: 5 }),
        taskService.getAll({ status: 'in-progress', limit: 1 }),
        taskService.getAll({ status: 'done', limit: 1 }),
      ]);
      const todo = all.pagination.total - inProg.pagination.total - done.pagination.total;
      setStats({
        total: all.pagination.total,
        todo: Math.max(todo, 0),
        inProgress: inProg.pagination.total,
        done: done.pagination.total,
      });
      setRecent(all.tasks);
    };
    load().catch(console.error);
  }, []);

  const statCards = [
    { label: 'Total Tasks', value: stats.total, textColor: 'text-white', bgLight: 'rgba(255,255,255,0.18)' },
    { label: 'To Do', value: stats.todo, textColor: 'text-yellow-200', bgLight: 'rgba(250,204,21,0.18)' },
    { label: 'In Progress', value: stats.inProgress, textColor: 'text-purple-200', bgLight: 'rgba(168,85,247,0.18)' },
    { label: 'Completed', value: stats.done, textColor: 'text-green-200', bgLight: 'rgba(34,197,94,0.18)' },
  ];

  const priorityBadge = (p: Task['priority']) => {
    const map = { low: 'bg-white/10 text-white/70', medium: 'bg-yellow-400/20 text-yellow-200', high: 'bg-red-400/20 text-red-200' };
    return map[p];
  };

  const statusBadge = (s: Task['status']) => {
    const map = { todo: 'bg-white/10 text-white/70', 'in-progress': 'bg-blue-300/20 text-blue-100', done: 'bg-green-400/20 text-green-200' };
    return map[s];
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-black/60 mt-1">Here&apos;s what&apos;s happening with your tasks today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: card.bgLight }}>
              <span className={`text-2xl font-bold ${card.textColor}`}>{card.value}</span>
            </div>
            <div>
              <p className="text-sm text-black/60">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-black">Recent Tasks</h2>
          <Link href="/dashboard/tasks" className="text-sm text-black/60 hover:text-black hover:underline">
            View all
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-black/50">No tasks yet.</p>
            <Link href="/dashboard/tasks" className="text-black/70 text-sm hover:text-black hover:underline mt-1 inline-block">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="-mx-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {recent.map((task) => (
              <div key={task._id} className="flex items-center justify-between px-6 py-3 transition-all"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div>
                  <p className="text-sm font-medium text-black">{task.title}</p>
                  {task.description && (
                    <p className="text-xs text-black/45 mt-0.5 line-clamp-1">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(task.status)}`}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
