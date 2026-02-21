'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setServerError(e.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          {/* Decorative ring icon */}
          <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)' }}>
            <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-black">Sign In</h1>
          <p className="text-black/60 text-sm mt-1">Please enter your details to sign in.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
            {serverError && (
              <div className="bg-red-500/20 border border-red-300/40 text-white rounded-lg px-4 py-3 text-sm">
                {serverError}
              </div>
            )}

            <div>
              <input
                type="email"
                {...register('email')}
                className="input-field"
                placeholder="Enter your email address"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-300 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <input
                type="password"
                {...register('password')}
                className="input-field"
                placeholder="Password"
                autoComplete="current-password"
              />
              {errors.password && <p className="text-red-300 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full mt-1">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-black/60 mt-4">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-black font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
