'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from './UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();
  const pathname = usePathname();

  const publicRoutes = ['/', '/login', '/signup', '/forget-password', '/product'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If it's a public route, render immediately
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Middleware handles redirects. This component purely manages client-side hydration for protected routes.
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
};
