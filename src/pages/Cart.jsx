import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const { cart, totalAmount, updateQuantity, removeFromCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Your cart is empty</h2>
        <Link to="/products" className="flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300">
          <ArrowLeft className="w-5 h-5 mr-2" /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center py-6 border-b border-gray-200 dark:border-slate-800 transition-colors">
              <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-2 flex-shrink-0 border border-gray-100">
              <img
                src={item.image || item.images?.[0]}
                alt={item.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f3f4f6&color=374151&size=200&font-size=0.2`;
                }}
              />
            </div>
              <div className="ml-6 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.brand}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between font-medium">
                  <p className="text-gray-900 dark:text-white">₹{item.price}</p>
                  <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 px-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-gray-900 dark:text-white border-x border-gray-200 dark:border-slate-700">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 px-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 transition-colors">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 w-full px-6 py-3 rounded-full bg-brand-600 text-white font-medium hover:bg-brand-700 transition block text-center shadow-sm">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
