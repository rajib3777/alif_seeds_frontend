import api from '../api';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { motion } from 'framer-motion';

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

// Map image path to correct full URL
function resolveImage(imagePath) {
  if (!imagePath) return '/cat2.jpg';
  // If it's already a full URL (http/https), use as-is
  if (imagePath.startsWith('http')) return imagePath;
  // If it's a local path starting with /, it's in /public — serve from frontend port
  if (imagePath.startsWith('/')) return imagePath;
  // Otherwise prepend /
  return '/' + imagePath;
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore(state => state.addToCart);
  const [activeSeason, setActiveSeason] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('products/')
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Products fetch error:', err);
        setLoading(false);
      });
  }, []);

  const seasons = [
    { id: 'All', name: 'সব' },
    { id: 'Winter', name: 'শীতকালীন' },
    { id: 'Summer', name: 'গ্রীষ্মকালীন' },
    { id: 'Year-round', name: 'বারোমাসি' }
  ];

  const filteredProducts = activeSeason === 'All' 
    ? products 
    : products.filter(p => p.season === activeSeason);

  const seasonMap = {
    'Winter': 'শীতকালীন',
    'Summer': 'গ্রীষ্মকালীন',
    'Year-round': 'বারোমাসি'
  };

  const localImages = ['/cat1.png', '/cat2.jpg', '/cat3.jpg', '/sorghum.jpg'];

  return (
    <section id="products" className="py-24 bg-darkGreen">
      <div className="container mx-auto px-8">
        <div className="text-center mb-12">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-3 font-semibold">আমাদের স্টোর</p>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">সব বীজ সমাহার</h2>
        </div>

        {/* Season Filter Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {seasons.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`px-6 py-2 rounded-full font-bold transition-all duration-300 border-2 ${
                activeSeason === s.id 
                  ? 'bg-gold border-gold text-darkGreen shadow-[0_0_20px_rgba(235,180,85,0.4)]' 
                  : 'bg-transparent border-white/20 text-white hover:border-gold hover:text-gold'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-midGreen rounded-xl h-72 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => {
            const imgSrc = resolveImage(product.image) || localImages[index % localImages.length];
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-midGreen rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group shadow-lg border border-white/5"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="h-56 relative overflow-hidden bg-midGreen">
                    <img
                      src={imgSrc}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        const fallbacks = ['/cat2.jpg', '/cat3.jpg', '/cat1.png', '/sorghum.jpg'];
                        const currentIndex = fallbacks.indexOf(e.target.src.replace(window.location.origin, ''));
                        e.target.src = fallbacks[(currentIndex + 1) % fallbacks.length];
                      }}
                    />
                    {!product.in_stock && (
                      <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs px-2 py-1 rounded font-bold tracking-wide">স্টক আউট</div>
                    )}
                    {product.is_special && (
                      <div className="absolute top-3 right-3 bg-gold text-darkGreen font-bold text-xs px-3 py-1 rounded shadow-lg uppercase">স্পেশাল</div>
                    )}
                    <div className="absolute bottom-3 left-3 bg-darkGreen/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/20 font-semibold uppercase tracking-wider group-hover:bg-gold group-hover:text-darkGreen transition-colors duration-300">
                      {seasonMap[product.season] || 'বারোমাসি'}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gold mb-2 font-bold tracking-wider uppercase">{product.category_name}</p>
                    <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-gold transition-colors">{product.name}</h3>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-2xl font-bold text-white">৳{parseFloat(product.price).toLocaleString()}</span>
                    <button
                      disabled={!product.in_stock}
                      onClick={(e) => { e.preventDefault(); addToCart(product); navigate('/cart'); }}
                      title="অর্ডার করুন"
                      className="px-4 py-2 rounded font-bold bg-gold text-darkGreen hover:bg-yellow-400 transition-all disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(235,180,85,0.4)] hover:shadow-[0_0_25px_rgba(235,180,85,0.6)] animate-pulse hover:animate-none hover:-translate-y-1"
                    >
                      <ShoppingCartIcon />
                      অর্ডার করুন
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
