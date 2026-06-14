import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Star, Truck, Plus, Minus, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cart.find(item => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data || null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.name} added!`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#333', color: '#fff' },
    });
  };

  const handleIncrease = () => updateQuantity(id, quantity + 1);
  const handleDecrease = () => {
    if (quantity === 1) removeFromCart(id);
    else updateQuantity(id, quantity - 1);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold dark:text-white mb-4">Product Not Found</h2>
      <Link to="/products" className="text-brand-600 hover:underline">Return to Catalog</Link>
    </div>
  );

  // Image source — fix: use image not images[0]
  const imgSrc = product.image || product.images?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in">
      <Link to="/products" className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Image Box — white background, proper fit, Blinkit style */}
        <div className="flex items-center justify-center bg-white dark:bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-8" style={{ minHeight: '380px' }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="max-h-72 w-auto object-contain"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=f3f4f6&color=374151&size=300&font-size=0.15`;
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h3 className="text-sm tracking-widest text-brand-600 dark:text-brand-400 uppercase font-semibold mb-2">{product.brand}</h3>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">{product.name}</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{product.unit}</p>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-4 text-yellow-400">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-5 h-5 ${i <= Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({product.rating} rating)</span>
          </div>

          {/* Price + Discount */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-3xl font-black text-gray-900 dark:text-white">₹{product.price}</p>
            {product.discount > 0 && (
              <span className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {product.discount}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{product.description}</p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex gap-2 mb-8 flex-wrap">
              {product.tags.map(tag => (
                <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-800 capitalize">{tag}</span>
              ))}
            </div>
          )}

          <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-8">
            {!product.inStock ? (
              <button disabled className="w-full flex items-center justify-center gap-2 bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400 px-8 py-4 rounded-full font-bold text-lg cursor-not-allowed">
                Out of Stock
              </button>
            ) : quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-6 h-6" /> Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-3 bg-brand-600 rounded-full px-2 py-2">
                  <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-brand-700 transition-colors">
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-white font-bold text-lg min-w-[32px] text-center">{quantity}</span>
                  <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-brand-700 transition-colors">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  Total: <span className="text-gray-900 dark:text-white font-bold">₹{product.price * quantity}</span>
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-2">
              <Truck className="w-5 h-5" /> Free Premium Shipping inside India
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
