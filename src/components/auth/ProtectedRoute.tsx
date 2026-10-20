import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminLogin from '../../pages/admin/AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // For admin routes, show the Admin Login form directly in place to avoid redirect 404s
    if (requireAdmin) {
      return <AdminLogin />;
    }
    return <Navigate to="/customer-login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin' && user?.role !== 'super_admin') {
    // Show admin login form with unauthorized state so admin credentials can be entered
    return <AdminLogin />;
  }

  return <>{children}</>;
}
