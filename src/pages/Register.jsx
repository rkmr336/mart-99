import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { registerUser } from '../firebase/auth';
import { ShoppingBag, Store, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';
  const [role, setRole] = useState(initialRole); // 'user' (Customer) or 'admin' (Shop Owner / Client)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'admin' || roleParam === 'user') {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const displayName = role === 'admin' && shopName.trim() ? `${name} (${shopName.trim()})` : name;
      await registerUser(email, password, displayName, role);
      
      if (role === 'admin') {
        toast.success('Shop Owner account created! Welcome to Dashboard.');
        navigate('/admin/dashboard');
      } else {
        toast.success('Account created successfully! Welcome to Mart 99.');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('This email is already registered. Please sign in.');
      } else {
        toast.error(error.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
        
        {/* Title */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-orange-500 flex items-center justify-center shadow-lg shadow-brand-500/25 mb-3 text-white">
            {role === 'admin' ? <Store className="w-7 h-7" /> : <ShoppingBag className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create an account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Sign up as Customer or Shop Owner
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-gray-100 dark:bg-slate-900 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setRole('user')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              role === 'user'
                ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
              role === 'admin'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Shop Owner</span>
          </button>
        </div>

        {/* Informative banner based on role */}
        {role === 'admin' ? (
          <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 text-orange-800 dark:text-orange-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <span>Register as Shop Owner / Client to manage live orders & store catalog.</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 text-brand-800 dark:text-brand-300 text-xs flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
            <span>Register as Customer to purchase items, track orders and save addresses.</span>
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder={role === 'admin' ? "Owner Name" : "Your Name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {role === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Shop / Business Name (Optional)
                </label>
                <input
                  type="text"
                  className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
                  placeholder="e.g. Mart 99 Central Store"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-md active:scale-[0.98] ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:ring-orange-500'
                  : 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500'
              } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign up as {role === 'admin' ? 'Shop Owner' : 'Customer'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link 
            to={`/login?role=${role}`} 
            className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 underline underline-offset-2"
          >
            Sign in as {role === 'admin' ? 'Shop Owner' : 'Customer'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
