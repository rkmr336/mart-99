import { useState } from 'react';
import { addProduct } from '../../firebase/firestore';
import { GROCERY_DATA } from '../../data/mockProducts';
import { Database, Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SeedDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  const handleSeed = async () => {
    if (!window.confirm("WARNING: This will DELETE all existing products and push the new 100+ Indian products to your live Firebase database. Proceed?")) return;
    
    setLoading(true);
    setStatus('running');
    setProgress(0);
    
    let count = 0;
    try {
      const { getProducts, deleteProduct } = await import('../../firebase/firestore');
      
      console.log("Fetching existing products...");
      const existingProducts = await getProducts();
      console.log(`Found ${existingProducts.length} existing products. Deleting them...`);
      
      // Delete existing products one by one
      for (const prod of existingProducts) {
         await deleteProduct(prod.id);
      }
      
      console.log("Old products wiped. Starting new migration of " + GROCERY_DATA.length + " products...");

      // Add new ones
      for (const item of GROCERY_DATA) {
        await addProduct(item);
        count++;
        setProgress(Math.round((count / GROCERY_DATA.length) * 100));
      }
      setStatus('success');
      toast.success(`Successfully migrated ${count} new products!`);
    } catch (error) {
      console.error("Migration error:", error);
      setStatus('error');
      toast.error(error.message || 'Error occurred during migration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 transition-colors">
        <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Database className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Database Migration</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
          This secure utility reads your local `mockProducts.js` file and synchronizes the entire catalog up to your live Google Firebase Cloud Firestore database.
        </p>

        {status === 'success' ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-col">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg font-bold text-green-700 dark:text-green-400">Migration Complete</p>
            <p className="text-sm text-green-600/80 dark:text-green-500 text-center mt-2">All items safely stored in Cloud.</p>
          </div>
        ) : (
          <div>
            <button 
              onClick={handleSeed}
              disabled={loading}
              className={`w-full max-w-md mx-auto flex items-center justify-center gap-3 py-4 rounded-full font-bold text-lg text-white shadow-md transition-all ${
                loading ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <><Loader className="w-5 h-5 animate-spin" /> Migrating... {progress}%</>
              ) : (
                <>Run Cloud Migration</>
              )}
            </button>
            <div className="mt-6 text-sm text-gray-400 dark:text-gray-500">Target Collection: `products` • Environment: Production</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedDatabase;
