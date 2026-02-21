import { http, HttpError } from '@/lib/api/http';

export interface Rating {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRatingData {
  bookingId: string;
  providerId: string;
  rating: number;
  comment?: string;
}

/**
 * Submit a rating for a service provider
 * POST /api/ratings
 */
export async function submitRating(data: CreateRatingData): Promise<Rating> {
  try {
    const response = await http<{ message: string; rating: Rating }>(
      '/api/ratings',
      {
        method: 'POST',
        body: data,
      }
    );
    return response.rating;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to submit rating');
  }
}

/**
 * Get ratings for a provider
 * GET /api/providers/:id/ratings
 */
export async function getProviderRatings(providerId: string): Promise<Rating[]> {
  try {
    const response = await http<{ message: string; ratings: Rating[] }>(
      `/api/providers/${providerId}/ratings`
    );
    return response.ratings || [];
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch provider ratings');
  }
}

/**
 * Get ratings by a user
 * GET /api/users/:id/ratings
 */
export async function getUserRatings(userId: string): Promise<Rating[]> {
  try {
    const response = await http<{ message: string; ratings: Rating[] }>(
      `/api/users/${userId}/ratings`
    );
    return response.ratings || [];
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 404) {
        return [];
      }
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch user ratings');
  }
}

/**
 * Get rating for a specific booking
 * GET /api/bookings/:id/rating
 */
export async function getRatingForBooking(bookingId: string): Promise<Rating | null> {
  try {
    const response = await http<{ message: string; rating: Rating | null }>(
      `/api/bookings/${bookingId}/rating`
    );
    return response.rating || null;
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
    return null;
  }
}
