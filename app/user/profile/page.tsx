'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, setUser, isUser, isProvider } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { updateUserProfileWithAvatar } from '@/lib/api/users.api';
import { HttpError } from '@/lib/api/http';
import { useToastContext } from '@/providers/ToastProvider';

export default function EditProfilePage() {
    const router = useRouter();
    const toast = useToastContext();
    const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        const currentUser = getUser();
        if (!currentUser) {
            router.replace('/login');
            return;
        }

        setUserState(currentUser);
        // Initialize phone with +977- prefix if empty or doesn't have it
        let phoneValue = currentUser.phone || '';
        if (phoneValue && !phoneValue.startsWith('+977-')) {
            // If phone exists but doesn't have prefix, add it
            phoneValue = '+977-' + phoneValue.replace(/^\+977-?/, '');
        } else if (!phoneValue) {
            // If no phone, set default prefix
            phoneValue = '+977-';
        }
        setFormData({
            name: currentUser.name || '',
            phone: phoneValue,
        });
        if (currentUser.profileImageUrl) {
            setAvatarPreview(
                currentUser.profileImageUrl.startsWith('http')
                    ? currentUser.profileImageUrl
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}${currentUser.profileImageUrl}`
            );
        }
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Special handling for phone number to ensure +977- prefix is always present
        if (name === 'phone') {
            // If user tries to delete the prefix, prevent it
            if (value.length < 6) { // +977- is 6 characters
                setFormData((prev) => ({ ...prev, phone: '+977-' }));
                return;
            }

            // If prefix is missing, add it
            if (!value.startsWith('+977-')) {
                // Extract digits only and add prefix
                const digitsOnly = value.replace(/[^\d]/g, '').slice(0, 10);
                setFormData((prev) => ({ ...prev, phone: '+977-' + digitsOnly }));
                return;
            }

            // Extract digits after prefix, limit to 10 digits
            const afterPrefix = value.slice(6); // +977- is 6 characters
            const digitsOnly = afterPrefix.replace(/[^\d]/g, '').slice(0, 10);
            setFormData((prev) => ({ ...prev, phone: '+977-' + digitsOnly }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            setAvatarFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview(user?.profileImageUrl
            ? (user.profileImageUrl.startsWith('http')
                ? user.profileImageUrl
                : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}${user.profileImageUrl}`)
            : null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare form data - if phone is just "+977-", treat it as empty
            const submitData = {
                ...formData,
                phone: formData.phone === '+977-' ? '' : formData.phone,
            };

            // Update profile with or without avatar
            const updatedUser = await updateUserProfileWithAvatar(submitData, avatarFile || undefined);

            // Update local storage
            setUser(updatedUser);
            setUserState(updatedUser);

            toast.success('Profile updated successfully');

            // Update avatar preview if it was changed
            if (updatedUser.profileImageUrl) {
                setAvatarPreview(
                    updatedUser.profileImageUrl.startsWith('http')
                        ? updatedUser.profileImageUrl
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}${updatedUser.profileImageUrl}`
                );
            }

            // Navigate/Stay
            // Requirement doesn't specify redirect. existing code redirects.
            // I'll leave it to stay or redirect to same page logic (refresh effectively).

        } catch (err) {
            if (err instanceof HttpError) {
                toast.error(err.message || 'Failed to update profile');
            } else {
                toast.error('An unexpected error occurred');
            }
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!mounted || !user) {
        return (
            <RouteGuard requireAuth redirectTo="/login">
                <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
                    <div className="text-lg text-white/70">Loading...</div>
                </div>
            </RouteGuard>
        );
    }

    return (
        <RouteGuard requireAuth redirectTo="/login">
            <div className="min-h-screen bg-[#0A2640]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Edit Profile
                            </h1>
                            <p className="text-white/70">Update your profile information</p>
                        </div>

                        <div className="rounded-2xl bg-[#1C3D5B] border border-white/10 p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-white/10">
                                    <div className="relative">
                                        <div className="w-32 h-32 rounded-full bg-[#69E6A6] flex items-center justify-center overflow-hidden border-4 border-white/20">
                                            {avatarPreview ? (
                                                <img
                                                    src={avatarPreview}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[#0A2640] font-bold text-4xl">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        {avatarPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveAvatar}
                                                className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                                                title="Remove avatar"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            id="avatar-upload"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="px-4 py-2 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold cursor-pointer transition-colors"
                                        >
                                            {avatarPreview ? 'Change Photo' : 'Upload Photo'}
                                        </label>
                                        <p className="text-white/50 text-xs text-center">
                                            JPEG, PNG or WEBP (max 5MB)
                                        </p>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-white/90 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#69E6A6] focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-white/90 mb-2">
                                        Phone Number <span className="text-white/50 text-xs">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                                            <span className="text-white/70">+977-</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone.replace(/^\+977-/, '')}
                                            onChange={handleInputChange}
                                            onFocus={(e) => {
                                                const len = e.target.value.length;
                                                e.target.setSelectionRange(len, len);
                                            }}
                                            className="w-full pl-16 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#69E6A6] focus:border-transparent transition-all"
                                            placeholder="XXXXXXXXX"
                                            pattern="[0-9]{9,10}"
                                            maxLength={10}
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-white/50">
                                        Enter 9-10 digits (prefix +977- is fixed)
                                    </p>
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={user.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-white/50">
                                        Email cannot be changed
                                    </p>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 bg-[#69E6A6] hover:bg-[#5dd195] text-[#0A2640] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        disabled={loading}
                                        className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </RouteGuard>
    );
}
