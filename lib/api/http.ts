import { clearAuth } from '@/lib/auth/auth.storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions extends RequestInit {
  method?: HttpMethod;
  body?: unknown;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export class HttpError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  code?: string;

  constructor(status: number, message: string, errors?: Record<string, string[]>, code?: string) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.code = code;
    this.name = 'HttpError';
  }
}

export async function http<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  // Get base URL - default to localhost:4000 for development
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
  const url = `${baseUrl}${endpoint}`;

  const { method = 'GET', body, headers = {}, ...restOptions } = options;

  // Get auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...restOptions,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    let data: any = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      const errors = data.errors || data.validationErrors;
      const code = data.code;

      // Handle 401 authentication errors globally
      if (response.status === 401) {
        // Clear auth data
        if (typeof window !== 'undefined') {
          clearAuth();
          // Redirect to login page with current path as next parameter
          const currentPath = window.location.pathname + window.location.search;
          const redirectPath = currentPath !== '/login' && currentPath !== '/register'
            ? `/login?next=${encodeURIComponent(currentPath)}`
            : '/login';
          
          // Queue redirect in next event loop tick to ensure it happens before error propagation
          // This prevents Next.js error overlay from appearing
          Promise.resolve().then(() => {
            window.location.replace(redirectPath);
          });
          
          // Throw error - redirect will happen before it can be displayed
          throw new HttpError(response.status, errorMessage, errors, code);
        }
      }

      throw new HttpError(response.status, errorMessage, errors, code);
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    // Better error messages for network errors
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      const errorMsg = baseUrl 
        ? `Failed to connect to server at ${baseUrl}. Please ensure the backend is running.`
        : 'Failed to connect to server. Please check your API configuration.';
      throw new HttpError(0, errorMsg);
    }

    throw new HttpError(500, error instanceof Error ? error.message : 'Network error');
  }
}

