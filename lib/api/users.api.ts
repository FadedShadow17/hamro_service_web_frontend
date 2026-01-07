import { http, HttpError } from './http';
import { User } from '../auth/auth.storage';

export interface UpdateUserProfileDTO {
  name?: string;
  phone?: string;
}

export interface UpdateUserProfileResponse {
  message: string;
  user: User;
}

/**
 * Update user profile
 * PATCH /api/users/me
 */
export async function updateUserProfile(data: UpdateUserProfileDTO): Promise<User> {
  try {
    const response = await http<UpdateUserProfileResponse>('/api/users/me', {
      method: 'PATCH',
      body: data,
    });
    return response.user;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update profile');
  }
}

/**
 * Upload profile avatar
 * POST /api/users/me/avatar
 */
export async function uploadAvatar(file: File): Promise<User> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${baseUrl}/api/users/me/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status,
        errorData.message || 'Failed to upload avatar',
        errorData.errors,
        errorData.code
      );
    }

    const result = await response.json();
    return result.user;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to upload avatar');
  }
}

/**
 * Update user profile with avatar (multipart form)
 * PATCH /api/users/me (with file)
 */
export async function updateUserProfileWithAvatar(
  data: UpdateUserProfileDTO,
  avatarFile?: File
): Promise<User> {
  try {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.phone) formData.append('phone', data.phone);
    if (avatarFile) formData.append('avatar', avatarFile);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${baseUrl}/api/users/me`, {
      method: 'PATCH',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status,
        errorData.message || 'Failed to update profile',
        errorData.errors,
        errorData.code
      );
    }

    const result = await response.json();
    return result.user;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update profile');
  }
}

