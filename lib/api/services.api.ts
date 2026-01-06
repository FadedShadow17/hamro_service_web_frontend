import { http, HttpError } from './http';

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailableProvider {
  providerId: string;
  providerName: string;
  area: string;
  phone?: string;
  bio?: string;
  price: number;
}

export async function getServices(active?: boolean): Promise<Service[]> {
  try {
    const query = active !== undefined ? `?active=${active}` : '';
    const response = await http<{ services: Service[] }>(`/api/services${query}`, {
      method: 'GET',
    });
    return response.services;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch services');
  }
}

export async function getServiceById(id: string): Promise<Service> {
  try {
    const response = await http<{ service: Service }>(`/api/services/${id}`, {
      method: 'GET',
    });
    return response.service;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch service');
  }
}

export async function getAvailableProviders(
  serviceId: string,
  date: string,
  area: string
): Promise<AvailableProvider[]> {
  try {
    const response = await http<{ providers: AvailableProvider[] }>(
      `/api/services/${serviceId}/providers?date=${date}&area=${encodeURIComponent(area)}`,
      {
        method: 'GET',
      }
    );
    return response.providers;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch available providers');
  }
}

