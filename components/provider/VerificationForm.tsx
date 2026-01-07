'use client';

import { useState, useEffect } from 'react';
import { getVerificationStatus, submitVerification, type VerificationData, type SubmitVerificationData } from '@/lib/api/provider-verification.api';
import { HttpError } from '@/lib/api/http';

interface VerificationFormProps {
  onSuccess?: () => void;
}

export function VerificationForm({ onSuccess }: VerificationFormProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [error, setError] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationData | null>(null);
  
  const [formData, setFormData] = useState<SubmitVerificationData>({
    fullName: '',
    phoneNumber: '',
    citizenshipNumber: '',
    address: {
      province: '',
      district: '',
      municipality: '',
      ward: '',
      tole: '',
      street: '',
    },
  });

  const [images, setImages] = useState<{
    citizenshipFront?: File;
    citizenshipBack?: File;
    profileImage?: File;
    selfie?: File;
  }>({});

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      setLoadingStatus(true);
      const status = await getVerificationStatus();
      setVerificationStatus(status);
      
      // Pre-fill form if already submitted
      if (status.fullName) {
        setFormData({
          fullName: status.fullName || '',
          phoneNumber: status.phoneNumber || '',
          citizenshipNumber: status.citizenshipNumber || '',
          address: status.address || {
            province: '',
            district: '',
            municipality: '',
            ward: '',
            tole: '',
            street: '',
          },
        });
      }
    } catch (err) {
      if (err instanceof HttpError && err.status !== 404) {
        setError(err.message);
      }
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleImageChange = (field: 'citizenshipFront' | 'citizenshipBack' | 'profileImage' | 'selfie', file: File | null) => {
    if (file) {
      setImages({ ...images, [field]: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.citizenshipNumber) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.address.province || !formData.address.district || !formData.address.municipality || !formData.address.ward) {
      setError('Please fill in all required address fields');
      return;
    }

    if (!images.citizenshipFront || !images.citizenshipBack || !images.profileImage) {
      setError('Please upload citizenship front, citizenship back, and profile image');
      return;
    }

    try {
      setLoading(true);
      await submitVerification({
        ...formData,
        citizenshipFrontImage: images.citizenshipFront,
        citizenshipBackImage: images.citizenshipBack,
        profileImage: images.profileImage,
        selfieImage: images.selfie,
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        await loadVerificationStatus();
        alert('Verification documents submitted successfully! Your application is now pending review.');
      }
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message);
      } else {
        setError('Failed to submit verification. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-white/70">Loading verification status...</div>
      </div>
    );
  }

  // Show status if already submitted
  if (verificationStatus && verificationStatus.verificationStatus !== 'NOT_SUBMITTED') {
    const statusColors: Record<string, string> = {
      PENDING_REVIEW: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      APPROVED: 'bg-[#69E6A6]/20 text-[#69E6A6] border-[#69E6A6]/50',
      REJECTED: 'bg-red-500/20 text-red-400 border-red-500/50',
    };

    return (
      <div className="space-y-6">
        <div className={`rounded-2xl border p-6 ${statusColors[verificationStatus.verificationStatus] || 'bg-white/10 border-white/20'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Verification Status</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[verificationStatus.verificationStatus] || ''}`}>
              {verificationStatus.verificationStatus.replace('_', ' ')}
            </span>
          </div>
          
          {verificationStatus.verificationStatus === 'PENDING_REVIEW' && (
            <p className="text-white/80">
              Your verification documents are under review. You will be notified once the review is complete.
            </p>
          )}
          
          {verificationStatus.verificationStatus === 'APPROVED' && (
            <div>
              <p className="text-white/80 mb-2">✅ Your verification has been approved!</p>
              {verificationStatus.verifiedAt && (
                <p className="text-white/60 text-sm">
                  Verified on: {new Date(verificationStatus.verifiedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
          
          {verificationStatus.verificationStatus === 'REJECTED' && (
            <div>
              <p className="text-white/80 mb-2">❌ Your verification was rejected.</p>
              {verificationStatus.rejectionReason && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm font-medium mb-1">Reason:</p>
                  <p className="text-red-200 text-sm">{verificationStatus.rejectionReason}</p>
                </div>
              )}
              <button
                onClick={() => setVerificationStatus({ ...verificationStatus, verificationStatus: 'NOT_SUBMITTED' })}
                className="mt-4 px-6 py-2 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors"
              >
                Resubmit Documents
              </button>
            </div>
          )}
        </div>

        {verificationStatus.verificationStatus === 'REJECTED' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form fields will be shown below */}
          </form>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500/50 p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Full Name (as per Citizenship) <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Phone Number (Nepal) <span className="text-red-400">*</span>
        </label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          placeholder="+977-XXXXXXXXX"
          required
          pattern="\+977-[0-9]{9,10}"
          className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
        />
        <p className="mt-1 text-xs text-white/60">Format: +977-XXXXXXXXX (9-10 digits)</p>
      </div>

      {/* Citizenship Number */}
      <div>
        <label className="block text-sm font-medium text-white/80 mb-2">
          Citizenship Number <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={formData.citizenshipNumber}
          onChange={(e) => setFormData({ ...formData, citizenshipNumber: e.target.value })}
          required
          className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
        />
      </div>

      {/* Address Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Address (Nepal)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Province <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.address.province}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, province: e.target.value } })}
              required
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              District <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.address.district}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })}
              required
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Municipality <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.address.municipality}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, municipality: e.target.value } })}
              required
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Ward <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.address.ward}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, ward: e.target.value } })}
              required
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tole (Optional)
            </label>
            <input
              type="text"
              value={formData.address.tole || ''}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, tole: e.target.value } })}
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Street (Optional)
            </label>
            <input
              type="text"
              value={formData.address.street || ''}
              onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white focus:border-[#69E6A6] focus:outline-none focus:ring-2 focus:ring-[#69E6A6]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Image Uploads */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Document Uploads</h3>
        
        {/* Citizenship Front */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Citizenship Card (Front) <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange('citizenshipFront', e.target.files?.[0] || null)}
            required
            className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#69E6A6] file:text-[#0A2640] file:font-semibold file:cursor-pointer hover:file:bg-[#5dd195] transition-all"
          />
        </div>

        {/* Citizenship Back */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Citizenship Card (Back) <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange('citizenshipBack', e.target.files?.[0] || null)}
            required
            className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#69E6A6] file:text-[#0A2640] file:font-semibold file:cursor-pointer hover:file:bg-[#5dd195] transition-all"
          />
        </div>

        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Profile Image <span className="text-red-400">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange('profileImage', e.target.files?.[0] || null)}
            required
            className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#69E6A6] file:text-[#0A2640] file:font-semibold file:cursor-pointer hover:file:bg-[#5dd195] transition-all"
          />
        </div>

        {/* Selfie (Optional) */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Selfie (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange('selfie', e.target.files?.[0] || null)}
            className="w-full rounded-lg border border-white/20 bg-[#0A2640] py-3 px-4 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#69E6A6] file:text-[#0A2640] file:font-semibold file:cursor-pointer hover:file:bg-[#5dd195] transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-[#69E6A6] to-[#5dd195] hover:from-[#5dd195] hover:to-[#4fb882] text-[#0A2640] font-semibold transition-all hover:scale-105 shadow-lg shadow-[#69E6A6]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Verification'}
        </button>
      </div>
    </form>
  );
}

