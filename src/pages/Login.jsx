import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, getUserDoc, logoutUser } from '../firebase/auth';
import { ShoppingBag, Store, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' (Customer) or 'admin' (Shop Owner / Client)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      
      // Fetch Firestore user doc to verify user's role
      const userDocData = await getUserDoc(user.uid);
      const userRole = userDocData?.role || 'user';

      if (role === 'admin') {
        const authorizedOwnerEmails = ['businessbr53@gmail.com'];
        if (!authorizedOwnerEmails.includes(user.email?.toLowerCase())) {
          toast.error('Access denied. Only authorized shop owner can access Dashboard.');
          setLoading(false);
          return;
        }
        toast.success('Welcome to Shop Owner Dashboard!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        // Customer login
        const authorizedOwnerEmails = ['businessbr53@gmail.com'];
        if (authorizedOwnerEmails.includes(user.email?.toLowerCase())) {
          // Do not allow shop owner account to login via customer tab
          await logoutUser();
          toast.error('This is a Shop Owner account. Please switch to the "Shop Owner" tab to log in.');
          setLoading(false);
          return;
        }
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to log in. Please check your email and password.');
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
            Sign in to your account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Choose your account type to proceed
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
            <span>Shop Owner mode: Direct access to Order Management & Store Dashboard.</span>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900/40 text-brand-800 dark:text-brand-300 text-xs flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
            <span>Customer mode: Shop fresh groceries, view orders, and manage cart.</span>
          </div>
        )}

        <form className="mt-4 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3.5 py-3 border border-gray-300 dark:border-slate-600 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all"
                placeholder={role === 'admin' ? "owner@mart99.com" : "you@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
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
                  <span>Sign in as {role === 'admin' ? 'Shop Owner' : 'Customer'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>

        {role === 'user' ? (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 underline underline-offset-2"
            >
              Sign up as Customer
            </Link>
          </p>
        ) : (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Shop Owner portal is restricted to authorized Mart 99 administration.
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
