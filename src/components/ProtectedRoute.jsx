import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, preventAdmin = false }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const AUTHORIZED_OWNER_EMAILS = [
    'businessbr53@gmail.com',
  ];
  const userEmail = currentUser?.email?.toLowerCase();
  const isAuthorizedOwner = AUTHORIZED_OWNER_EMAILS.includes(userEmail) || userData?.role === 'admin' || userData?.role === 'owner';

  if (requireAdmin) {
    if (!isAuthorizedOwner) {
      return <Navigate to="/" replace />; // Redirects unauthorized users to home
    }
  }

  // Prevent shop owner from accessing customer-only checkout/orders pages
  if (preventAdmin && isAuthorizedOwner) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
