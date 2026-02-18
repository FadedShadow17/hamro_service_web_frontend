'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createProviderUser } from '@/lib/api/service-provider.api';
import Link from 'next/link';

export default function CreateUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '+977-',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            // Phone logic simplified for demo
            setFormData(prev => ({ ...prev, phone: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProviderUser(formData, avatarFile || undefined);
            router.push('/service-provider/users');
        } catch (error) {
            console.error(error);
            alert('Failed to create user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A2640] p-6 pt-20">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6">Create New User</h1>

                <div className="bg-[#1C3D5B] rounded-2xl p-8 border border-white/10 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex justify-center mb-6">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="w-24 h-24 rounded-full bg-[#69E6A6] flex items-center justify-center overflow-hidden border-4 border-white/10">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[#0A2640] text-3xl font-bold">+</span>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs">Upload</span>
                                </div>
                            </div>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                        </div>

                        <div className="space-y-4">
                            <input
                                name="name" placeholder="Full Name" required
                                value={formData.name} onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#69E6A6] outline-none transition-colors"
                            />
                            <input
                                name="email" type="email" placeholder="Email Address" required
                                value={formData.email} onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#69E6A6] outline-none transition-colors"
                            />
                            <input
                                name="password" type="password" placeholder="Password" required
                                value={formData.password} onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#69E6A6] outline-none transition-colors"
                            />
                            <input
                                name="phone" placeholder="Phone (+977-)"
                                value={formData.phone} onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#69E6A6] outline-none transition-colors"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit" disabled={loading}
                                className="flex-1 py-3 bg-[#69E6A6] text-[#0A2640] font-bold rounded-lg hover:bg-[#5dd195] transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                            <Link href="/service-provider/users" className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors">
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
