import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, ChevronDown } from 'lucide-react';
import { getProducts } from '../firebase/firestore';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cat = searchParams.get('cat');
    const search = searchParams.get('search');
    if (cat) setActiveCategory(cat);
    else setActiveCategory('All');
    if (search) setLocalSearch(search);
  }, [searchParams]);

  useEffect(() => {
    const fetch = async () => {
      try {
        let data = await getProducts();
        if (data.length === 0) {
          const { GROCERY_DATA } = await import('../data/mockProducts');
          const { addProduct } = await import('../firebase/firestore');
          for (const item of GROCERY_DATA) await addProduct(item);
          data = await getProducts();
        }
        setProducts(data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price_asc': return list.sort((a, b) => a.price - b.price);
      case 'price_desc': return list.sort((a, b) => b.price - a.price);
      case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [products, activeCategory, localSearch, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

      {/* ── Search + Sort bar — sticky just below navbar (navbar = ~128px) ── */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-[128px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                placeholder="Search products, brand or category..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
                <option value="name">A → Z</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Result count + active category label */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            {activeCategory === 'All' ? '🛒 All Products' : `${activeCategory} Products`}
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {loading ? '...' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200 dark:bg-slate-700" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-9 bg-gray-200 dark:bg-slate-700 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>

        /* Empty state */
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Koi product nahi mila</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Try a different search or category</p>
            <button
              onClick={() => { setLocalSearch(''); setActiveCategory('All'); }}
              className="px-6 py-2.5 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>

        /* Products */
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
