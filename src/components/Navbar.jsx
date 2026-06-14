import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Sun, Moon, Search, Menu, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { logoutUser } from '../firebase/auth';

const Navbar = () => {
  const { currentUser } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await logoutUser(); } catch (e) { console.error(e); }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <nav className="fixed w-full z-50 transition-colors duration-300">
      {/* Top strip */}
      <div className="bg-red-600 dark:bg-red-900 text-white text-xs px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>Deliver to: <strong>Your Location</strong></span>
        </div>
        <span>Free delivery on orders above ₹499 🎉</span>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-orange-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all duration-300 transform group-hover:-translate-y-0.5">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 hidden sm:block tracking-tight">
                Mart <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-orange-500">99</span>
              </span>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex">
              <div className="relative w-full flex">
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search atta, dahi, soap or any product..."
                  className="w-full pl-4 pr-4 py-2.5 rounded-l-xl border border-r-0 border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <button type="submit" className="px-5 bg-red-600 hover:bg-red-700 text-white rounded-r-xl flex items-center transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Theme toggle */}
              <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white dark:border-slate-900">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {currentUser ? (
                <div className="flex items-center gap-1">
                  <Link to="/profile" className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <User className="w-5 h-5" />
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-gray-300 dark:border-slate-700 rounded-xl hover:border-red-300">
                  Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-700 dark:text-gray-300">
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Category strip */}
        <div className="border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-sm font-medium">
              {[
                { label: '🛒 All', path: '/products' },
                { label: '🥛 Dairy', path: '/products?cat=Dairy' },
                { label: '🍿 Snacks', path: '/products?cat=Snacks' },
                { label: '🥤 Drinks', path: '/products?cat=Drinks' },
                { label: '🌾 Grocery', path: '/products?cat=Grocery' },
                { label: '🧹 Household', path: '/products?cat=Household' },
              ].map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="flex-1 px-3 py-2 rounded-l-lg border dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:outline-none dark:text-white" />
            <button className="px-4 bg-red-600 text-white rounded-r-lg"><Search className="w-4 h-4" /></button>
          </form>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 py-2 border-b dark:border-slate-800">Products</Link>
          {currentUser ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 py-2 border-b dark:border-slate-800">My Profile</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 py-2 border-b dark:border-slate-800">Orders</Link>
              <button onClick={handleLogout} className="block text-red-600 py-2">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-300 py-2">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
