import { http, HttpError } from './http';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';

export interface ServiceInfo {
  id: string;
  name: string;
  description?: string;
  basePrice?: number;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string; // Phone number (if available from user profile)
}

export interface ProviderInfo {
  id: string;
  fullName?: string; // From ProviderProfile verification
  serviceRole?: string; // From ProviderProfile
  phone?: string; // From ProviderProfile
}

export interface Booking {
  id: string;
  userId: string;
  providerId?: string | null; // Made optional and nullable
  serviceId: string;
  service?: ServiceInfo; // Service details when available
  user?: UserInfo; // User details when populated (for provider dashboard)
  provider?: ProviderInfo; // Provider details when populated (for user dashboard)
  date: string;
  timeSlot: string;
  area: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingDTO {
  providerId?: string; // Optional - backend will assign if not provided
  serviceId: string;
  date: string;
  timeSlot: string;
  area: string;
}

export async function createBooking(data: CreateBookingDTO): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>('/api/bookings', {
      method: 'POST',
      body: data,
    });
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to create booking');
  }
}

export async function getMyBookings(status?: BookingStatus): Promise<Booking[]> {
  try {
    const query = status ? `?status=${status}` : '';
    const response = await http<{ bookings: Booking[] }>(`/api/bookings/my${query}`, {
      method: 'GET',
    });
    return response.bookings;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch bookings');
  }
}

export async function getProviderBookings(status?: BookingStatus | 'ALL'): Promise<Booking[]> {
  try {
    // Normalize "ALL" to undefined (no filter) - backend handles undefined as "all bookings"
    const normalizedStatus = status && status !== 'ALL' ? status : undefined;
    const query = normalizedStatus ? `?status=${normalizedStatus}` : '';
    const response = await http<{ bookings: Booking[] }>(`/api/provider/bookings${query}`, {
      method: 'GET',
    });
    return response.bookings;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch provider bookings');
  }
}

/**
 * Cancel booking (user only)
 * PATCH /api/bookings/:id/cancel
 */
export async function cancelBooking(bookingId: string): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/bookings/${bookingId}/cancel`,
      {
        method: 'PATCH',
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to cancel booking');
  }
}

/**
 * Update booking status (unified endpoint for provider)
 * PATCH /api/provider/bookings/:id/status
 */
export async function updateProviderBookingStatus(
  bookingId: string,
  status: 'CONFIRMED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED'
): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/provider/bookings/${bookingId}/status`,
      {
        method: 'PATCH',
        body: { status },
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update booking status');
  }
}

/**
 * Dashboard summary interface
 */
export interface DashboardSummary {
  pending: number;
  confirmed: number;
  completed: number;
  total: number;
  upcoming: Booking[];
  recent: Booking[];
}

/**
 * Get provider dashboard summary
 * GET /api/provider/dashboard/summary
 */
export async function getProviderDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await http<DashboardSummary>('/api/provider/dashboard/summary', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch dashboard summary');
  }
}

