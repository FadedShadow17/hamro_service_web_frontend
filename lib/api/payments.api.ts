import { http, HttpError } from './http';
import { Booking } from './bookings.api';

/**
 * Get user's payable bookings (CONFIRMED status only)
 * GET /api/payments/me
 */
export async function getMyPayableBookings(): Promise<Booking[]> {
  try {
    const response = await http<{ bookings: Booking[] }>('/api/payments/me', {
      method: 'GET',
    });
    return response.bookings;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch payable bookings');
  }
}

/**
 * Pay for a booking
 * POST /api/payments/:bookingId/pay
 */
export async function payForBooking(
  bookingId: string,
  paymentMethod?: 'COD' | 'ONLINE'
): Promise<Booking> {
  try {
    const response = await http<{ message: string; booking: Booking }>(
      `/api/payments/${bookingId}/pay`,
      {
        method: 'POST',
        body: paymentMethod ? { paymentMethod } : {},
      }
    );
    return response.booking;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to process payment');
  }
}

