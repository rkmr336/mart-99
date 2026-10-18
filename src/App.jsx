import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminDashboard from './pages/admin/Dashboard';
import SeedDatabase from './pages/admin/SeedDatabase';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';

const AppContent = () => {
  const { currentUser, userData } = useAuth();
  const isOwner = currentUser?.email?.toLowerCase() === 'businessbr53@gmail.com' || userData?.role === 'admin' || userData?.role === 'owner';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
      <main className={`flex-grow ${isOwner ? 'pt-20' : 'pt-28'}`}>
        <Routes>
          <Route path="/" element={isOwner ? <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> : <Home />} />
          <Route path="/products" element={isOwner ? <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> : <Products />} />
          <Route path="/products/:id" element={isOwner ? <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> : <ProductDetail />} />
          <Route path="/cart" element={isOwner ? <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> : <Cart />} />
          <Route path="/wishlist" element={isOwner ? <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute> : <Wishlist />} />
          <Route path="/checkout" element={<ProtectedRoute preventAdmin={true}><Checkout /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute preventAdmin={true}><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute preventAdmin={true}><Orders /></ProtectedRoute>} />
          <Route path="/success/:id" element={<ProtectedRoute preventAdmin={true}><OrderSuccess /></ProtectedRoute>} />
          <Route path="/track/:id" element={<ProtectedRoute preventAdmin={true}><OrderTracking /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/seed" element={<ProtectedRoute requireAdmin={true}><SeedDatabase /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isOwner && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <AppContent />
              <Toaster position="bottom-right" />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
