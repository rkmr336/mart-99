import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Shield, RefreshCw, ChevronRight, Zap } from 'lucide-react';
import { getProducts } from '../firebase/firestore';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

const OFFERS = [
  { color: 'from-red-600 to-orange-500', title: 'Best Deals Today', sub: 'Up to 20% off on Dairy', link: '/products?cat=Dairy', emoji: '🥛' },
  { color: 'from-green-600 to-emerald-500', title: 'Grocery Essentials', sub: 'Atta, Rice & more essentials', link: '/products?cat=Grocery', emoji: '🌾' },
  { color: 'from-blue-600 to-indigo-500', title: 'Snacks & Drinks', sub: 'Party-ready products', link: '/products?cat=Snacks', emoji: '🍿' },
];

const FEATURES = [
  { icon: <Truck className="w-6 h-6" />, title: 'Fast Delivery', sub: 'Same-day & next-day' },
  { icon: <Shield className="w-6 h-6" />, title: '100% Genuine', sub: 'Authentic branded products' },
  { icon: <RefreshCw className="w-6 h-6" />, title: 'Easy Returns', sub: '7-day return policy' },
  { icon: <Zap className="w-6 h-6" />, title: 'Best Prices', sub: 'Lowest price guarantee' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const { wishlist } = useWishlist();

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        let all = await getProducts();
        if (all.length === 0) {
           console.log("Auto-seeding database because it is empty...");
           const { GROCERY_DATA } = await import('../data/mockProducts');
           const { addProduct } = await import('../firebase/firestore');
           for(const item of GROCERY_DATA) {
             await addProduct(item);
           }
           console.log("Auto-seeding complete!");
           all = await getProducts();
        }
        setFeatured(all.slice(0, 8));
      } catch (e) {
        console.error(e);
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">

      {/* Hero Banner */}
      <div className="w-full bg-[#d00000] dark:bg-slate-900">
        <Link to="/products" className="block max-w-[1600px] mx-auto cursor-pointer hover:opacity-95 transition-opacity">
          <img 
            src="/hero-banner.png" 
            alt="Sab Kuch Yahaan, Best Daam Pe!" 
            className="w-full h-auto object-contain"
          />
        </Link>
      </div>

      {/* Feature strips */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-slate-700">
            {FEATURES.map(f => (
              <div key={f.title} className="flex items-center gap-3 p-4 md:p-5">
                <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{f.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Offer Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFERS.map(o => (
            <Link
              key={o.title}
              to={o.link}
              className={`bg-gradient-to-r ${o.color} rounded-2xl p-6 text-white flex items-center justify-between hover:scale-[1.02] transition-transform duration-200 shadow-md`}
            >
              <div>
                <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-1">Special Offer</p>
                <h3 className="text-lg font-extrabold mb-0.5">{o.title}</h3>
                <p className="text-sm text-white/80">{o.sub}</p>
              </div>
              <div className="text-5xl">{o.emoji}</div>
            </Link>
          ))}
        </div>

        {/* Wishlist Section */}
        {wishlist && wishlist.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                ❤️ My Wishlist
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {wishlist.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Popular Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              🔥 Popular Products
            </h2>
            <Link to="/products" className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 hover:gap-2 transition-all">
              Sab dekho <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Bottom CTA banner */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">🚀 Apna Account Banao</h2>
          <p className="text-gray-300 mb-6 text-base max-w-md mx-auto">Sign up to track orders, get exclusive deals and faster checkout!</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg transition-all">
            Register Now — Free!
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;
