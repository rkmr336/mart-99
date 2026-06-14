import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="/products" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">All Products</Link></li>
                  <li><Link to="/products?cat=Grocery" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Grocery & Staples</Link></li>
                  <li><Link to="/products?cat=Dairy" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Dairy & Breakfast</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Contact Us</Link></li>
                  <li><Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">FAQ</Link></li>
                  <li><Link to="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Shipping & Returns</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 xl:mt-0">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
              Subscribe to our newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              The latest products, articles, and resources, sent to your inbox weekly.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <input type="email" placeholder="Enter your email" className="appearance-none min-w-0 w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md py-2 px-4 text-base text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:max-w-xs transition-colors" />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button type="submit" className="w-full bg-brand-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-base font-medium text-white hover:bg-brand-700 transition">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-slate-800 pt-8 flex items-center justify-between transition-colors duration-300">
          <p className="text-base text-gray-400 dark:text-gray-500 xl:text-center">
            &copy; {new Date().getFullYear()} Mart 99. All rights reserved.
          </p>
          <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 tracking-tight flex items-center gap-1">
            <span className="text-red-500">🛒</span> MART<span className="font-light">99</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
