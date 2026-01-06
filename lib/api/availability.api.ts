import { http, HttpError } from './http';

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Availability {
  id: string;
  providerId: string;
  dayOfWeek: number;
  timeSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAvailabilityDTO {
  dayOfWeek: number;
  timeSlots: TimeSlot[];
}

export async function getAvailability(): Promise<Availability[]> {
  try {
    const response = await http<{ availability: Availability[] }>('/api/provider/availability', {
      method: 'GET',
    });
    return response.availability;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch availability');
  }
}

export async function updateAvailability(data: UpdateAvailabilityDTO[]): Promise<Availability[]> {
  try {
    const response = await http<{ message: string; availability: Availability[] }>(
      '/api/provider/availability',
      {
        method: 'PUT',
        body: data,
      }
    );
    return response.availability;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to update availability');
  }
}

