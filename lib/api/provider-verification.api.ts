import { http, HttpError } from './http';

export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface VerificationData {
  verificationStatus: VerificationStatus;
  fullName?: string;
  phoneNumber?: string;
  citizenshipNumber?: string;
  serviceRole?: string;
  address?: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    tole?: string;
    street?: string;
  };
  citizenshipFrontImage?: string;
  citizenshipBackImage?: string;
  profileImage?: string;
  selfieImage?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface SubmitVerificationData {
  fullName: string;
  phoneNumber: string;
  citizenshipNumber: string;
  serviceRole: string;
  address: {
    province: string;
    district: string;
    municipality: string;
    ward: string;
    tole?: string;
    street?: string;
  };
  citizenshipFrontImage?: File;
  citizenshipBackImage?: File;
  profileImage?: File;
  selfieImage?: File;
}

export async function getVerificationStatus(): Promise<VerificationData> {
  try {
    const response = await http<VerificationData>('/api/provider/verification', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to fetch verification status');
  }
}

export async function submitVerification(data: SubmitVerificationData): Promise<VerificationData> {
  try {
    const formData = new FormData();
    
    formData.append('fullName', data.fullName);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('citizenshipNumber', data.citizenshipNumber);
    formData.append('serviceRole', data.serviceRole);
    formData.append('address', JSON.stringify(data.address));
    
    if (data.citizenshipFrontImage) {
      formData.append('citizenshipFront', data.citizenshipFrontImage);
    }
    if (data.citizenshipBackImage) {
      formData.append('citizenshipBack', data.citizenshipBackImage);
    }
    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }
    if (data.selfieImage) {
      formData.append('selfie', data.selfieImage);
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const response = await fetch(`${baseUrl}/api/provider/verification`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpError(
        response.status, 
        errorData.message || 'Failed to submit verification',
        errorData.errors
      );
    }

    const result = await response.json();
    return result.profile;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    throw new HttpError(500, 'Failed to submit verification');
  }
}

