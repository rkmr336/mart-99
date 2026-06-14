import { X, Package, MapPin, Phone, User, CreditCard, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils/orderHelpers';

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-slate-700 relative">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-500" />
              Order {order.orderId}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleString('en-US', {
                dateStyle: 'medium', timeStyle: 'short'
              }) : 'N/A'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Customer & Delivery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-500" /> Customer
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                  {order.customerDetails?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {order.customerDetails?.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-slate-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" /> Delivery
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {order.customerDetails?.address || 'No address provided'}
                  {order.customerDetails?.landmark && <><br/>Landmark: {order.customerDetails.landmark}</>}
                  <br/>PIN: <span className="font-semibold">{order.customerDetails?.pincode || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Items Ordered ({order.items?.length || 0})
            </h3>
            <div className="border border-gray-100 dark:border-slate-700 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
              {order.items?.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-brand-50 dark:bg-brand-900/10 p-5 rounded-xl border border-brand-100 dark:border-brand-900/30">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Payment Summary
            </h3>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatCurrency(order.pricing?.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Delivery Fee</span>
                <span>{order.pricing?.deliveryFee === 0 ? 'Free' : formatCurrency(order.pricing?.deliveryFee)}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <span className="font-bold text-gray-900 dark:text-white">Total</span>
              <div className="text-right">
                <span className="font-black text-xl text-brand-600 dark:text-brand-400">{formatCurrency(order.pricing?.total || 0)}</span>
                <p className="text-xs font-semibold uppercase mt-1 text-gray-500">
                  {order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '✅ Paid Online'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
