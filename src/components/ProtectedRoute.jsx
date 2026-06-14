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
    // 🔐 ADMIN LOCK: Add your shop owner email here!
    const ADMIN_EMAILS = [
      'mart811311@gmail.com',         // <--- Change this to your real email
      'admin@rohitmart99.com'    // <--- You can add multiple emails
    ];

    if (!ADMIN_EMAILS.includes(currentUser?.email)) {
      return <Navigate to="/" />; // Redirects normal users to home
    }
  }

  return children;
};

export default ProtectedRoute;
