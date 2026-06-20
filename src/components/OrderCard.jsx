import { ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/orderHelpers';

const OrderCard = ({ order, viewMode = 'user', onStatusUpdate, onViewDetails, onCodCollected }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'preparing': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const renderStatusDropdown = () => {
    if (viewMode !== 'admin') return null;
    return (
      <select 
        value={order.orderStatus}
        onChange={(e) => onStatusUpdate(order.id, e.target.value)}
        className="text-xs font-semibold rounded-lg px-2 py-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-sm outline-none w-full sm:w-auto"
      >
        <option value="pending">🟡 Pending</option>
        <option value="confirmed">🔵 Confirmed</option>
        <option value="preparing">🟠 Preparing</option>
        <option value="out_for_delivery">🟣 Out for Delivery</option>
        <option value="delivered">🟢 Delivered</option>
        <option value="cancelled">🔴 Cancelled</option>
      </select>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden transition-colors">
      <div className="p-5 border-b border-gray-100 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{order.orderId}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }) : 'Processing...'}
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-2">
          <p className="font-extrabold text-lg text-gray-900 dark:text-white">{formatCurrency(order.pricing?.total || 0)}</p>
          <div className="flex gap-2 w-full md:w-auto">
            {viewMode === 'admin' ? renderStatusDropdown() : (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center ${
                order.paymentMethod === 'COD' 
                ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              }`}>
                {order.paymentMethod === 'COD' ? '💵 COD' : '✅ Online'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50 flex-wrap gap-4">
        <div className="flex -space-x-3 overflow-hidden">
          {order.items?.slice(0, 4).map((item, idx) => (
            <img key={idx} className="inline-block h-10 w-10 border border-gray-200 dark:border-slate-700 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover" src={item.image || 'https://via.placeholder.com/40'} alt={item.name} />
          ))}
          {order.items?.length > 4 && (
            <div className="flex items-center justify-center h-10 w-10 border border-gray-200 dark:border-slate-700 rounded-full ring-2 ring-white dark:ring-slate-800 bg-white dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-gray-300">
              +{order.items.length - 4}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {viewMode === 'admin' && order.paymentMethod === 'COD' && ['delivered', 'out_for_delivery'].includes(order.orderStatus) && (
            <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
              <input 
                type="checkbox" 
                checked={order.deliveryDetails?.codCollected || false}
                onChange={() => onCodCollected && onCodCollected(order.id, order.deliveryDetails?.codCollected)}
                className="text-green-600 rounded focus:ring-green-500 w-4.5 h-4.5 border-gray-300" 
              />
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">COD Collected</span>
            </label>
          )}
          
          <button onClick={() => onViewDetails(order)} className="flex items-center gap-1 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 transition-colors">
            {viewMode === 'admin' ? 'Manage Order' : 'Track Order'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
