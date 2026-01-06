import { http, HttpError } from './http';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getServiceCategories(active?: boolean): Promise<ServiceCategory[]> {
  try {
    const query = active !== undefined ? `?active=${active}` : '';
    const response = await http<{ categories: ServiceCategory[] }>(`/api/service-categories${query}`, {
      method: 'GET',
    });
    return response.categories;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch service categories');
  }
}

