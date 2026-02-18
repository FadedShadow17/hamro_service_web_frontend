import { http, HttpError } from './http';
import { User } from '../auth/auth.storage';

const API_BASE = '/api/service-provider';

interface UsersResponse {
    users: User[];
}

interface UserResponse {
    user: User;
}

export async function getProviderUsers(): Promise<User[]> {
    const res = await http<UsersResponse>(`${API_BASE}/users`);
    return res.users;
}

export async function getProviderUser(id: string): Promise<User> {
    const res = await http<UserResponse>(`${API_BASE}/users/${id}`);
    return res.user;
}

export async function createProviderUser(data: Record<string, any>, file?: File): Promise<User> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('image', file);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${baseUrl}${API_BASE}/users`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(response.status, errorData.message || 'Failed', errorData.errors);
    }
    const result = await response.json();
    return result.user;
}

export async function updateProviderUser(id: string, data: Record<string, any>, file?: File): Promise<User> {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('image', file);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${baseUrl}${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new HttpError(response.status, errorData.message || 'Failed', errorData.errors);
    }
    const result = await response.json();
    return result.user;
}

export async function deleteProviderUser(id: string): Promise<void> {
    await http(`${API_BASE}/users/${id}`, { method: 'DELETE' });
}
