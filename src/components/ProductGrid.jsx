import api from '../api';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useSearchStore } from '../store/useSearchStore';
import { motion } from 'framer-motion';

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

function resolveImage(imagePath) {
  if (!imagePath) return '/cat2.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return imagePath;
  return '/' + imagePath;
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore(state => state.addToCart);
  const { searchQuery, selectedCategory, setCategory, setHasNoResults } = useSearchStore();
  const [activeSeason, setActiveSeason] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('products/')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.error('Products fetch error:', err); setLoading(false); });
  }, []);

  const seasons = [
    { id: 'All', name: 'সব' },
    { id: 'Winter', name: 'শীতকালীন' },
    { id: 'Summer', name: 'গ্রীষ্মকালীন' },
    { id: 'Year-round', name: 'বারোমাসি' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSeason = activeSeason === 'All' || p.season === activeSeason;
    let matchesCategory = true;
    if (selectedCategory) {
      const catText = selectedCategory.toLowerCase();
      const pCat = (p.category_name || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      matchesCategory = pCat.includes(catText) || catText.includes(pCat) ||
                        pName.includes(catText) || catText.includes(pName);
    }
    let matchesSearch = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const searchTerms = [query];
      if (query.includes('beej') || query.includes('biji') || query.includes('biz')) searchTerms.push('বীজ');
      if (query.includes('sobji') || query.includes('shobji')) searchTerms.push('সবজি');
      if (query.includes('fol') || query.includes('phol')) searchTerms.push('ফল');
      if (query.includes('dhan')) searchTerms.push('ধান');
      if (query.includes('gom')) searchTerms.push('গম');
      if (query.includes('bhutta')) searchTerms.push('ভুট্টা');
      if (query.includes('jowar')) searchTerms.push('জোয়ার');
      if (query.includes('combo')) searchTerms.push('কম্বো');
      const pSearchable = `${p.name} ${p.category_name || ''}`.toLowerCase();
      matchesSearch = searchTerms.some(term => pSearchable.includes(term));
    }
    return matchesSeason && matchesCategory && matchesSearch;
  });

  const noResults = (searchQuery || selectedCategory) && filteredProducts.length === 0;

  useEffect(() => {
    setHasNoResults(noResults);
  }, [noResults, setHasNoResults]);

  // Always show products - if filter matches nothing, still show all
  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  const seasonMap = { 'Winter': 'শীতকালীন', 'Summer': 'গ্রীষ্মকালীন', 'Year-round': 'বারোমাসি' };
  const localImages = ['/cat1.png', '/cat2.jpg', '/cat3.jpg', '/sorghum.jpg'];

  return (
    <section id="products" className="py-16 bg-darkGreen min-h-[500px]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2 font-semibold">আমাদের স্টোর</p>
          <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
            {selectedCategory ? `${selectedCategory} — পণ্যসমূহ` : 'সব বীজ সমাহার'}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full"></div>
          {selectedCategory && (
            <button onClick={() => setCategory('')} className="mt-3 text-sm text-gold hover:text-white underline font-semibold">
              সব ক্যাটাগরি দেখুন ✕
            </button>
          )}
        </div>

        {/* Season Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {seasons.map(s => (
            <button key={s.id} onClick={() => setActiveSeason(s.id)}
              className={`px-5 py-2 rounded-full font-bold transition-all duration-300 border-2 text-sm ${
                activeSeason === s.id
                  ? 'bg-gold border-gold text-darkGreen shadow-[0_0_20px_rgba(235,180,85,0.4)]'
                  : 'bg-transparent border-white/20 text-white hover:border-gold hover:text-gold'
              }`}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-midGreen rounded-xl h-72 animate-pulse border border-white/5" />
            ))}
          </div>
        )}

        {/* "Not found" banner — products still shown below */}
        {noResults && (
          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="text-4xl">🔍</div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-bold text-base">স্টকে নেই অথবা পাওয়া যায়নি</p>
              <p className="text-gray-300 text-sm mt-0.5">
                {searchQuery && <span>"<strong className="text-gold">{searchQuery}</strong>" খুঁজে পাওয়া যায়নি। </span>}
                নিচে সব পণ্য থেকে দেখুন।
              </p>
            </div>
            <button onClick={() => { setCategory(''); }}
              className="bg-gold text-[#112a1f] font-bold px-4 py-2 rounded-lg text-sm hover:bg-yellow-300 transition whitespace-nowrap">
              সব দেখুন
            </button>
          </div>
        )}

        {/* Product Grid — always shows all products when filter finds nothing */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {displayProducts.map((product, index) => {
              const imgSrc = resolveImage(product.image) || localImages[index % localImages.length];
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className="bg-midGreen flex flex-col rounded-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group shadow-lg border border-white/5 h-full"
                >
                  <Link to={`/product/${product.id}`} className="block flex-1">
                    <div className="h-56 relative overflow-hidden bg-midGreen">
                      <img src={imgSrc} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          const fb = ['/cat2.jpg', '/cat3.jpg', '/cat1.png', '/sorghum.jpg'];
                          const ci = fb.indexOf(e.target.src.replace(window.location.origin, ''));
                          e.target.src = fb[(ci + 1) % fb.length];
                        }}
                      />
                      {!product.in_stock && (
                        <div className="absolute top-3 left-3 bg-red-600/90 text-white text-xs px-2 py-1 rounded font-bold">স্টক আউট</div>
                      )}
                      {product.is_special && (
                        <div className="absolute top-3 right-3 bg-gold text-darkGreen font-bold text-xs px-3 py-1 rounded shadow-lg uppercase">স্পেশাল</div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-darkGreen/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full border border-white/20 font-semibold uppercase tracking-wider group-hover:bg-gold group-hover:text-darkGreen transition-colors duration-300">
                        {seasonMap[product.season] || 'বারোমাসি'}
                      </div>
                    </div>
                    <div className="p-5 pb-2">
                      <p className="text-xs text-gold mb-1 font-bold tracking-wider uppercase">{product.category_name}</p>
                      <h3 className="text-base font-bold text-white mb-1 leading-snug group-hover:text-gold transition-colors">{product.name}</h3>
                    </div>
                  </Link>
                  <div className="px-5 pb-5 mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-white">৳{parseFloat(product.price).toLocaleString()}</span>
                      {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
                        <span className="text-sm font-semibold text-gray-400 line-through">৳{parseFloat(product.original_price).toLocaleString()}</span>
                      )}
                    </div>
                    
                    {product.in_stock && product.stock_quantity < 10 && (
                      <p className="text-[10px] text-red-400 font-bold mb-3 animate-pulse">
                        ⚠️ মাত্র {product.stock_quantity} টি স্টকে আছে!
                      </p>
                    )}

                    <div className="flex flex-col gap-2">
                      <button disabled={!product.in_stock}
                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                        className="w-full px-4 py-2 rounded font-bold border-2 border-gold text-gold hover:bg-gold/10 transition-all disabled:opacity-50 text-sm">
                        কার্টে যোগ করুন
                      </button>
                      <button disabled={!product.in_stock}
                        onClick={(e) => { e.preventDefault(); addToCart(product); navigate('/cart'); }}
                        className={`w-full px-4 py-2 rounded font-bold flex items-center justify-center gap-2 transition-all ${product.in_stock ? 'bg-gold text-darkGreen hover:bg-yellow-400 shadow-[0_0_15px_rgba(235,180,85,0.4)] animate-bounce' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}>
                        <ShoppingCartIcon />
                        {product.in_stock ? 'অর্ডার করুন' : 'স্টক আউট'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
