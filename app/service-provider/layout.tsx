'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, USER_ROLES } from '@/lib/auth/auth.storage';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function ServiceProviderLayout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [isRoleAuthorized, setIsRoleAuthorized] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const user = getUser();
        // If not user, RouteGuard will assume logic, but we check role here too.
        if (user) {
            if (user.role !== USER_ROLES.SERVICE_PROVIDER) {
                // Redirect unauthorized users
                router.replace('/dashboard');
            } else {
                setIsRoleAuthorized(true);
            }
        }
        setIsChecking(false);
    }, [router]);

    return (
        <RouteGuard requireAuth>
            {(!isChecking && isRoleAuthorized) ? children : (
                <div className="flex min-h-screen items-center justify-center bg-[#0A2640]">
                    <div className="text-lg text-white/70">Loading...</div>
                </div>
            )}
        </RouteGuard>
    );
}
