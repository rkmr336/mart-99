import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl">
          <Heart className="w-6 h-6 fill-red-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Wishlist</h1>
        <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-semibold ml-2">
          {wishlist.length} Items
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border border-gray-100 dark:border-slate-700">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Save items you love to your wishlist. Review them anytime and easily move them to your cart.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-600 text-white font-bold rounded-full shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:bg-brand-700 transition-all duration-300"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
