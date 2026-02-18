'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProviderUsers } from '@/lib/api/service-provider.api';
import { User } from '@/lib/auth/auth.storage';

export default function ServiceProviderUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            const data = await getProviderUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A2640] p-6 pt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Users Management</h1>
                        <p className="text-white/60">Manage users visible to your service</p>
                    </div>
                    <Link
                        href="/service-provider/users/create"
                        className="px-6 py-3 bg-[#69E6A6] text-[#0A2640] rounded-lg font-bold hover:bg-[#5dd195] transition-all transform hover:scale-105 shadow-lg shadow-[#69E6A6]/20"
                    >
                        Create User
                    </Link>
                </div>

                <div className="bg-[#1C3D5B] rounded-2xl overflow-hidden shadow-xl border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-white/10">
                            <thead className="bg-[#0A2640]/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#69E6A6] uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#69E6A6] uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#69E6A6] uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-[#69E6A6] uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-[#69E6A6] uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loading ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-white/50 animate-pulse">Loading users...</td></tr>
                                ) : users.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-12 text-center text-white/50">No users found. Create one to get started.</td></tr>
                                ) : (
                                    users.map(user => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-[#69E6A6] to-[#4DB380] rounded-full flex items-center justify-center text-[#0A2640] font-bold shadow-md">
                                                        {user.profileImageUrl ? (
                                                            <img
                                                                src={user.profileImageUrl.startsWith('http') ? user.profileImageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'}${user.profileImageUrl}`}
                                                                alt=""
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            user.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white group-hover:text-[#69E6A6] transition-colors">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">{user.phone || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'provider' || user.role === 'service_provider' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <Link href={`/service-provider/users/${user.id}`} className="text-white/60 hover:text-white transition-colors">View</Link>
                                                <Link href={`/service-provider/users/${user.id}/edit`} className="text-[#69E6A6] hover:text-[#5dd195] transition-colors">Edit</Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
