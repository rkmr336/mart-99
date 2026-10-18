import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
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

  if (requireAdmin) {
    // Check if user has admin/shop owner role or admin custom property
    const isAdmin = userData?.role === 'admin' || userData?.role === 'owner';

    if (!isAdmin) {
      return <Navigate to="/" replace />; // Redirects normal customers to home
    }
  }

  return children;
};

export default ProtectedRoute;
