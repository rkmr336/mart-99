import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { getUserOrders } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser) {
        try {
          const data = await getUserOrders(currentUser.uid);
          // Hide cancelled orders from the customer's view as requested
          const activeOrders = data.filter(order => order.orderStatus !== 'cancelled');
          setOrders(activeOrders);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchOrders();
  }, [currentUser]);

  const handleTrackOrder = (order) => {
    navigate(`/track/${order.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="md:w-1/4 hidden md:block">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Navigation</h2>
            <nav className="w-full space-y-2">
              <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors">
                <span className="w-5 h-5 flex justify-center items-center">👤</span> <span>My Profile</span>
              </Link>
              <Link to="/orders" className="flex items-center space-x-3 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium transition-colors">
                <Package className="w-5 h-5" /> <span>My Orders</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Order History</h1>
          
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden text-center py-16 transition-colors">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">When you place an order, it will show up here.</p>
              <Link to="/products" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors shadow-sm">
                Start Shopping <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  viewMode="user" 
                  onViewDetails={handleTrackOrder} 
                />
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Orders;
