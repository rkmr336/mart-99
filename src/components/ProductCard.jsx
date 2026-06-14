import { useCart } from '../context/CartContext';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const badgeStyles = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  gold: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
};

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Check karo ki ye product cart mein hai ya nahi
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added!`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    });
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    if (quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col">
      {/* Badge */}
      {product.badge && (
        <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-2 py-1 rounded-full ${badgeStyles[product.badgeColor] || badgeStyles.green}`}>
          {product.badge}
        </span>
      )}

      {/* Discount badge */}
      {product.discount > 0 && (
        <span className="absolute top-3 right-3 z-10 text-xs font-bold px-2 py-1 rounded-full bg-green-500 text-white">
          {product.discount}% OFF
        </span>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden bg-gray-50 dark:bg-slate-700">
        <div className="h-44 flex items-center justify-center p-4 bg-white rounded-t-2xl">
          <img
            src={product.image || product.images?.[0] || 'https://placehold.co/300?text=Mart+99'}
            alt={product.name}
            className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f3f4f6&color=374151&size=200&font-size=0.2`; }}
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1 uppercase tracking-wide">{product.brand}</p>
        <Link to={`/products/${product.id}`}>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white leading-snug mb-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2">
            {product.name}
          </h2>
        </Link>

        {/* Unit */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{product.unit}</p>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-black text-gray-900 dark:text-white">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>

          {/* Quantity Selector — Blinkit style */}
          {quantity === 0 ? (
            // ADD button — product cart mein nahi hai
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`flex items-center justify-center gap-1 py-2 px-5 rounded-xl font-bold text-sm transition-all duration-200
                ${product.inStock
                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 border border-brand-300 dark:border-brand-700 hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:hover:bg-brand-600 dark:hover:text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-slate-600 cursor-not-allowed'
                }`}
            >
              {product.inStock ? (
                <><Plus className="w-4 h-4" /> ADD</>
              ) : (
                'Out of Stock'
              )}
            </button>
          ) : (
            // Quantity selector — product cart mein hai
            <div className="flex items-center gap-2 bg-brand-600 rounded-xl px-1 py-1">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:bg-brand-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-white font-bold text-sm min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
