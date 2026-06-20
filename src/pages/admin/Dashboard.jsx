import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, TrendingUp, Settings, Search } from 'lucide-react';
import { getAllOrdersAdmin, getProducts, updateOrderStatus, updateOrderCodCollection } from '../../firebase/firestore';
import OrderCard from '../../components/OrderCard';
import OrderDetailsModal from '../../components/OrderDetailsModal';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getAllOrdersAdmin(),
          getProducts()
        ]);
        setOrders(ordersData);
        setProductsCount(productsData.length);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus, `Status manually updated to ${newStatus}`, 'admin');

      setOrders(orders.map(o => o.id === orderId ? { 
        ...o, 
        orderStatus: newStatus,
        statusHistory: [...(o.statusHistory || []), { status: newStatus, timestamp: { toDate: () => new Date() } }]
      } : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleCodCollected = async (orderId, currentVal) => {
    try {
      await updateOrderCodCollection(orderId, !currentVal);
      setOrders(orders.map(o => o.id === orderId ? { 
        ...o, 
        deliveryDetails: { ...o.deliveryDetails, codCollected: !currentVal }
      } : o));
      toast.success(`COD marked as ${!currentVal ? 'collected' : 'pending'}`);
    } catch (err) {
      toast.error('Failed to update COD status');
    }
  };

  // Math aggregates
  const totalOrders = orders.length;
  const uniqueCustomers = new Set(orders.map(o => o.userId)).size;
  
  // Calculate Total Revenue (Includes Online payments and collected COD)
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.orderStatus === 'cancelled') return sum;
    
    if (order.paymentMethod === 'COD') {
      if (order.orderStatus === 'delivered' && order.deliveryDetails?.codCollected) {
        return sum + (order.pricing?.total || 0);
      }
    } else {
      // Online payments are already collected
      return sum + (order.pricing?.total || 0);
    }
    return sum;
  }, 0);

  // Pending COD only applies to COD orders
  const pendingCodAmount = orders.reduce((sum, order) => {
    if (order.paymentMethod === 'COD') {
      if (order.orderStatus === 'out_for_delivery' || (order.orderStatus === 'delivered' && !order.deliveryDetails?.codCollected)) {
        return sum + (order.pricing?.total || 0);
      }
    }
    return sum;
  }, 0);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter(o => o.orderStatus === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.orderId?.toLowerCase().includes(q) || 
        o.customerDetails?.name?.toLowerCase().includes(q) || 
        o.customerDetails?.phone?.includes(q)
      );
    }
    
    return result;
  }, [orders, activeTab, searchQuery]);

  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: '🟡 Pending' },
    { id: 'confirmed', label: '🔵 Confirmed' },
    { id: 'preparing', label: '🟠 Preparing' },
    { id: 'out_for_delivery', label: '🟣 Out for Delivery' },
    { id: 'delivered', label: '🟢 Delivered' },
    { id: 'cancelled', label: '🔴 Cancelled' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white transition-colors">Admin Command Center</h1>
        <div className="flex gap-2">
          <Link to="/admin/seed" className="text-sm bg-gray-100 dark:bg-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-gray-700 dark:text-gray-300">
            Migration Utility
          </Link>
          <Link to="/profile" className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium bg-brand-50 dark:bg-brand-900/20 px-4 py-2 rounded-lg transition-colors">
            Exit Admin
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-colors">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue Collected</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{totalRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-colors">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg mr-4">
            <span className="text-xl">💵</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending COD to Collect</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{pendingCodAmount.toLocaleString('en-IN')}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-colors">
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg mr-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : totalOrders}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center transition-colors">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Customers</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{loading ? '...' : uniqueCustomers}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 transition-colors overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 dark:border-slate-700 pb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Management</h2>
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search ID, Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
        
        {/* Horizontal scroll tabs */}
        <div className="flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-slate-600'
              }`}>
                {tab.id === 'all' ? orders.length : orders.filter(o => o.orderStatus === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 rounded-xl">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
            <p className="text-lg font-medium">No orders found.</p>
            <p className="text-sm">Try adjusting your tabs or search query.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="relative">
                <OrderCard 
                  order={order} 
                  viewMode="admin" 
                  onStatusUpdate={handleStatusChange} 
                  onViewDetails={(order) => setSelectedOrder(order)} 
                />
                
                {/* Specific overlay for marking COD as collected on Delivered Orders (Only for COD Orders) */}
                {order.paymentMethod === 'COD' && ['delivered', 'out_for_delivery'].includes(order.orderStatus) && (
                  <div className="sm:absolute sm:bottom-4 sm:right-4 mt-2 sm:mt-0 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 z-10 w-fit">
                     <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={order.deliveryDetails?.codCollected || false}
                        onChange={() => handleCodCollected(order.id, order.deliveryDetails?.codCollected)}
                        className="text-green-600 rounded focus:ring-green-500 w-5 h-5 border-gray-300" 
                      />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200">COD Collected</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
