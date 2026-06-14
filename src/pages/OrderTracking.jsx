import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listenToOrder, updateOrderStatus } from '../firebase/firestore';
import OrderTimeline from '../components/OrderTimeline';
import PriceBreakdown from '../components/PriceBreakdown';
import { formatCurrency } from '../utils/orderHelpers';
import { ArrowLeft, Phone, Ban } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToOrder(id, (data) => {
      if (data) {
        if (order && order.orderStatus !== data.orderStatus) {
            toast(`Order status updated to ${data.orderStatus}`, { icon: '🔔' });
        }
        setOrder(data);
      } else {
        toast.error('Order not found!');
        navigate('/orders');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await updateOrderStatus(id, 'cancelled', 'User requested cancellation', 'system');
        toast.success("Order cancelled successfully");
      } catch (err) {
        toast.error("Failed to cancel order");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
            Track Order
          </h1>
          <p className="text-brand-600 font-mono font-bold mt-1 text-lg">{order.orderId}</p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Placed On</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : 'Processing...'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
             <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-700 pb-4">Live Timeline</h2>
             <OrderTimeline currentStatus={order.orderStatus} statusHistory={order.statusHistory || []} />
          </div>

          {order.orderStatus === 'out_for_delivery' && order.deliveryDetails?.deliveryBoy && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
                🛵 Delivery Partner Assigned
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{order.deliveryDetails.deliveryBoy.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.deliveryDetails.deliveryBoy.vehicle}</p>
                </div>
                <a href={`tel:${order.deliveryDetails.deliveryBoy.phone}`} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  <Phone className="w-4 h-4" /> Call Partner
                </a>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">Items Ordered</h2>
            <ul className="divide-y divide-gray-100 dark:divide-slate-700">
              {order.items?.map((item, idx) => (
                <li key={idx} className="py-4 flex gap-4">
                  <img 
                    src={item.image || item.images?.[0] || `https://placehold.co/80x80/f3f4f6/9ca3af?text=${encodeURIComponent(item.name?.charAt(0) || '?')}`} 
                    alt={item.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 dark:border-slate-700 flex-shrink-0"
                    onError={(e) => { e.target.src = `https://placehold.co/80x80/f3f4f6/9ca3af?text=${encodeURIComponent(item.name?.charAt(0) || '?')}` }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.subtotal)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">Payment Details</h2>
            <div className={`mb-4 p-3 rounded-lg border flex items-center justify-between ${
              order.paymentMethod === 'COD' 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-green-100 dark:border-green-800/50'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-blue-100 dark:border-blue-800/50'
            }`}>
              <span className="font-bold flex items-center gap-2">
                {order.paymentMethod === 'COD' ? '💵 Cash on Delivery (COD)' : '✅ Paid Online (UPI / Card)'}
              </span>
              <span className="font-extrabold text-lg">{formatCurrency(order.pricing?.total || 0)}</span>
            </div>
            <PriceBreakdown subtotal={order.pricing?.subtotal} />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-slate-700 pb-4">Delivery Address</h2>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p className="font-bold text-gray-900 dark:text-white mb-1">{order.customerDetails?.name}</p>
              <p>{order.customerDetails?.address?.line1}</p>
              <p>{order.customerDetails?.address?.line2}</p>
              <p>{order.customerDetails?.address?.city}, {order.customerDetails?.address?.state} - {order.customerDetails?.address?.pincode}</p>
              <p className="mt-2 font-medium">📞 {order.customerDetails?.phone}</p>
            </div>
          </div>

          {['pending', 'confirmed'].includes(order.orderStatus) && (
            <button 
              onClick={handleCancel}
              className="w-full flex justify-center items-center gap-2 py-3 border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl font-bold transition-colors"
            >
              <Ban className="w-4 h-4" /> Cancel Order
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
