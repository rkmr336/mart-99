import { CheckCircle, Copy, Package } from 'lucide-react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { formatCurrency, getEstimatedDelivery } from '../utils/orderHelpers';
import { CUSTOMER_CARE } from '../utils/constants';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state || {};
  
  const orderId = state.orderId || 'RM99-UNKNOWN';
  const total = state.total || 0;
  const paymentMethod = state.paymentMethod || 'COD';
  const isCOD = paymentMethod === 'COD';
  const estimatedDelivery = state.estimatedDelivery ? new Date(state.estimatedDelivery) : getEstimatedDelivery();

  const handleCopy = () => {
    navigator.clipboard.writeText(orderId);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-in zoom-in-95 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        
        {/* Header Section */}
        <div className="bg-green-50 dark:bg-green-900/30 p-8 text-center border-b border-green-100 dark:border-green-800/50">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-300">Thank you for shopping with Rohit Mart 99.</p>
        </div>

        {/* Actionable Info Box */}
        <div className="p-8">
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 mb-8 text-center">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">
              {isCOD ? 'Amount to pay on delivery' : 'Amount Paid Online'}
            </p>
            <p className="text-5xl font-extrabold text-brand-600 dark:text-brand-400 mb-4">{formatCurrency(total)}</p>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600">
              <span className="text-sm text-gray-600 dark:text-gray-300">Order ID:</span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">{orderId}</span>
              <button onClick={handleCopy} className="text-brand-600 hover:text-brand-700 ml-2" title="Copy ID"><Copy className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                 <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Estimated Delivery</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Today by {estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCOD ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                       : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              }`}>
                 <span className="text-xl">{isCOD ? '💵' : '✅'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Payment Method</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {isCOD ? 'Cash on Delivery (COD)' : 'Paid Online (UPI / Card)'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-900/50 rounded-xl p-5 mb-8">
            <h3 className="font-bold text-brand-900 dark:text-brand-300 mb-3 text-sm flex items-center gap-2">
              <span className="text-lg">📌</span> Important Instructions
            </h3>
            <ul className="space-y-2 text-sm text-brand-800 dark:text-brand-200">
              {isCOD ? (
                <>
                  <li className="flex gap-2"><span>•</span> Please keep exact change of {formatCurrency(total)} ready.</li>
                  <li className="flex gap-2"><span>•</span> Our delivery partner will call you before arriving.</li>
                  <li className="flex gap-2"><span>•</span> You can check the products before making payment.</li>
                </>
              ) : (
                <>
                  <li className="flex gap-2"><span>•</span> Your payment of {formatCurrency(total)} has been received. ✅</li>
                  <li className="flex gap-2"><span>•</span> Our delivery partner will call you before arriving.</li>
                  <li className="flex gap-2"><span>•</span> No payment needed at delivery — already paid online.</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/track/${id}`} className="flex-1 flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md">
              Track My Order
            </Link>
            <Link to="/products" className="flex-1 flex justify-center items-center gap-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600 font-bold py-3.5 px-6 rounded-xl transition-all">
              Continue Shopping
            </Link>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-gray-50 dark:bg-slate-900 p-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-700">
          Need help? <br /> Call Customer Care at <span className="font-semibold text-gray-700 dark:text-gray-300">{CUSTOMER_CARE.phone}</span> or <span className="font-semibold text-gray-700 dark:text-gray-300">WhatsApp Us</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
