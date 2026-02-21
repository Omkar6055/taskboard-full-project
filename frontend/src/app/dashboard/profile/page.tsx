'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/lib/profile';
import { AxiosError } from 'axios';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  bio: z.string().max(500).optional(),
  avatar: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type ProfileForm = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(6, 'Min 6 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', bio: user?.bio ?? '', avatar: user?.avatar ?? '' },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = async (data: ProfileForm) => {
    setProfileMsg(''); setProfileErr('');
    setProfileLoading(true);
    try {
      const updated = await profileService.update(data);
      setUser(updated);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setProfileErr(e.response?.data?.message || 'Update failed.');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPwMsg(''); setPwErr('');
    setPwLoading(true);
    try {
      await profileService.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      setPwMsg('Password changed successfully.');
      passwordForm.reset();
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setPwErr(e.response?.data?.message || 'Failed to change password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

      {/* Avatar Preview */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-16 h-16 object-cover" />
          ) : (
            <span className="text-2xl font-bold text-emerald-700">{user?.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          {user?.bio && <p className="text-sm text-gray-400 mt-1">{user.bio}</p>}
        </div>
      </div>

      {/* Profile Form */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Edit Profile</h2>

        {profileMsg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">{profileMsg}</div>}
        {profileErr && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{profileErr}</div>}

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input {...profileForm.register('name')} className="input-field" />
            {profileForm.formState.errors.name && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea {...profileForm.register('bio')} rows={3} className="input-field resize-none" placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input {...profileForm.register('avatar')} className="input-field" placeholder="https://..." />
            {profileForm.formState.errors.avatar && (
              <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.avatar.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={profileLoading} className="btn-primary">
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>

        {pwMsg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm mb-4">{pwMsg}</div>}
        {pwErr && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{pwErr}</div>}

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input type="password" {...passwordForm.register('currentPassword')} className="input-field" autoComplete="current-password" />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" {...passwordForm.register('newPassword')} className="input-field" autoComplete="new-password" />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input type="password" {...passwordForm.register('confirmPassword')} className="input-field" autoComplete="new-password" />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={pwLoading} className="btn-primary">
              {pwLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
