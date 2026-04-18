import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

import api from '../api';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    api.get(`products/${id}/`)
      .then(res => { setProduct(res.data); setLoading(false); })
      .catch(() => setLoading(false));
      
    api.get('products/')
      .then(res => {
        const others = res.data.filter(p => String(p.id) !== String(id)).slice(0, 4);
        setRelatedProducts(others);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkGreen flex items-center justify-center">
        <div className="animate-spin w-16 h-16 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-darkGreen flex items-center justify-center text-white text-2xl">
        পণ্য খুঁজে পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkGreen py-16">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Breadcrumb */}
        <nav className="text-gray-400 text-sm mb-8">
          <button onClick={() => navigate('/')} className="hover:text-gold transition">হোম</button>
          <span className="mx-2">/</span>
          <span className="text-gold font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute top-4 left-4 w-32 h-32 bg-gold rounded-lg z-0"></div>
            <img
              src={product.image || '/cat2.jpg'}
              alt={product.name}
              className="relative z-10 w-full rounded-2xl shadow-2xl border-4 border-midGreen object-cover max-h-[500px]"
              onError={(e) => { e.target.onerror = null; e.target.src = '/sorghum.jpg'; }}
            />
            {product.is_special && (
              <div className="absolute top-6 right-6 z-20 bg-gold text-darkGreen font-bold text-sm px-4 py-2 rounded-full shadow-lg uppercase">
                স্পেশাল পণ্য
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col"
          >
            <p className="text-gold uppercase font-bold tracking-widest text-sm mb-2">{product.category_name}</p>
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-gold fill-gold" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-gray-400 text-sm ml-2">(৩২ টি রিভিউ)</span>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="bg-midGreen rounded-2xl p-6 mb-8 border border-white/10">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-2">মূল্য</p>
              <p className="text-5xl font-bold text-gold">৳{parseFloat(product.price).toLocaleString()}</p>
              <p className="text-gray-400 text-sm mt-1">প্রতি কেজি</p>
            </div>

            {/* Stock status */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-8 w-fit ${product.in_stock ? 'bg-green-900/40 text-green-400 border border-green-700' : 'bg-red-900/40 text-red-400 border border-red-700'}`}>
              <div className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              {product.in_stock ? 'স্টকে আছে' : 'স্টক নেই'}
            </div>

            {/* Quantity + Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-midGreen rounded-xl p-2 border border-white/10">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-white hover:text-gold rounded-lg transition text-xl font-bold"
                >−</button>
                <span className="font-bold text-2xl text-white w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-white hover:text-gold rounded-lg transition text-xl font-bold"
                >+</button>
              </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <button
                disabled={!product.in_stock}
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${added ? 'bg-green-500 text-white' : 'bg-midGreen text-white border border-gold hover:bg-gold hover:text-darkGreen'} disabled:opacity-50`}
              >
                <ShoppingCartIcon /> {added ? 'কার্টে যোগ হয়েছে' : 'কার্টে যোগ করুন'}
              </button>

              <button
                disabled={!product.in_stock}
                onClick={() => { handleAddToCart(); navigate('/checkout'); }}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-gold text-darkGreen hover:bg-yellow-400 hover:scale-105 shadow-[0_0_15px_rgba(235,180,85,0.4)] transition-all disabled:opacity-50 animate-pulse hover:animate-none"
              >
                🛍️ অর্ডার করুন
              </button>

              <a
                href={`https://wa.me/8801334642219?text=${encodeURIComponent(`আমি ${product.name} অর্ডার করতে চাই।`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] text-white hover:bg-[#128C7E] hover:scale-105 transition-all"
              >
                💬 হোয়াটসঅ্যাপে অর্ডার করুন
              </a>

              <a
                href="tel:01334642219"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all cursor-pointer"
              >
                📞 কলের মাধ্যমে অর্ডার করুন
              </a>
            </div>
            </div>

            {/* Go to cart button */}
            {added && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => navigate('/cart')}
                className="mt-4 w-full border-2 border-gold text-gold py-3 rounded-xl font-bold hover:bg-gold hover:text-darkGreen transition text-center"
              >
                কার্ট দেখুন →
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Same Delivery Charge Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-white/10 pt-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white flex flex-col md:flex-row items-center gap-4">
                <span className="bg-gold text-darkGreen px-4 py-1.5 rounded-full text-sm uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(235,180,85,0.5)]">অফার</span> 
                কনফার্ম করার আগে আরো প্রোডাক্ট অ্যাড করতে চান?
              </h3>
              <Link to="/" className="bg-transparent border-2 border-gold text-gold px-6 py-2 rounded-full font-bold hover:bg-gold hover:text-darkGreen transition-all flex items-center gap-2">
                আরো বীজ দেখুন →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {relatedProducts.map(rp => (
                <Link to={`/product/${rp.id}`} key={rp.id} className="bg-midGreen rounded-xl overflow-hidden shadow-lg border border-white/5 hover:-translate-y-2 transition-all block group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={rp.image?.startsWith('/') || rp.image?.startsWith('http') ? rp.image : '/' + (rp.image||'cat1.png')} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => e.target.src='/cat2.jpg'} />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gold uppercase mb-1 font-bold">{rp.category_name}</p>
                    <h4 className="text-white font-bold text-lg mb-2 truncate">{rp.name}</h4>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-white font-bold text-xl">৳{parseFloat(rp.price).toLocaleString()}</p>
                      <span className="text-gold text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">দেখুন →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
