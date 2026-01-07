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

export interface Booking {
  id: string;
  userId: string;
  providerId?: string | null; // Made optional and nullable
  serviceId: string;
  service?: ServiceInfo; // Service details when available
  user?: UserInfo; // User details when populated (for provider dashboard)
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

export async function getProviderBookings(status?: BookingStatus): Promise<Booking[]> {
  try {
    const query = status ? `?status=${status}` : '';
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

export async function acceptBooking(bookingId: string): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/provider/bookings/${bookingId}/accept`,
      {
        method: 'PATCH',
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to accept booking');
  }
}

export async function declineBooking(bookingId: string): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/provider/bookings/${bookingId}/decline`,
      {
        method: 'PATCH',
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to decline booking');
  }
}

export async function completeBooking(bookingId: string): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/provider/bookings/${bookingId}/complete`,
      {
        method: 'PATCH',
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to complete booking');
  }
}

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

