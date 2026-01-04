import { http, HttpError } from '@/lib/api/http';
import { getToken } from '@/lib/auth/auth.storage';
import { ContactFormData } from './contact.schemas';

export interface ContactMessage {
  id: string;
  userId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  adminReply?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactResponse {
  message: string;
  contact: ContactMessage;
}

export interface GetMyContactsResponse {
  message: string;
  contacts: ContactMessage[];
}

/**
 * Get authorization header with token
 */
function getAuthHeaders(): HeadersInit {
  const token = getToken();
  if (!token) {
    throw new HttpError(401, 'Authentication required');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Create a new contact message
 */
export async function createContact(data: ContactFormData): Promise<CreateContactResponse> {
  try {
    const response = await http<CreateContactResponse>('/api/v1/contact', {
      method: 'POST',
      body: data,
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to submit contact message');
  }
}

/**
 * Get logged-in user's contact messages
 */
export async function getMyContacts(): Promise<GetMyContactsResponse> {
  try {
    const response = await http<GetMyContactsResponse>('/api/v1/contact/me', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch contact messages');
  }
}

