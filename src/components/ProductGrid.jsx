import api from '../api';
import { useEffect, useState } from 'react';
import { useSearchStore } from '../store/useSearchStore';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, selectedCategory, setCategory, setHasNoResults } = useSearchStore();
  const [activeSeason, setActiveSeason] = useState('All');

  useEffect(() => {
    api.get('products/')
      .then(res => { setProducts(res.data); setLoading(false); })
      .catch(err => { console.error('Products fetch error:', err); setLoading(false); });
  }, []);

  const seasons = [
    { id: 'All', name: 'সব' },
    { id: 'Summer', name: 'গ্রীষ্মকালীন পণ্য' },
    { id: 'Winter', name: 'শীতকালীন পণ্য' },
    { id: 'Year-round', name: 'বারোমাসি পণ্য' }
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
      const pSearchable = `${p.name} ${p.category_name || ''}`.toLowerCase();
      matchesSearch = pSearchable.includes(query);
    }
    return matchesSeason && matchesCategory && matchesSearch;
  });

  const noResults = (searchQuery || selectedCategory) && filteredProducts.length === 0;

  useEffect(() => {
    setHasNoResults(noResults);
  }, [noResults, setHasNoResults]);

  if (loading) return (
    <div className="py-24 bg-darkGreen text-center text-gold font-black animate-pulse uppercase tracking-widest">লোড হচ্ছে...</div>
  );

  return (
    <section id="products" className="py-16 bg-darkGreen min-h-[500px] border-t border-white/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-gray-400 uppercase tracking-[0.3em] text-[10px] mb-2 font-black">আমাদের স্টোর</p>
          <h2 className="text-4xl font-black text-white uppercase tracking-wider">
            {selectedCategory ? `${selectedCategory} — পণ্যসমূহ` : 'সব বীজ সমাহার'}
          </h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-4 rounded-full"></div>
          {selectedCategory && (
            <button onClick={() => setCategory('')} className="mt-4 text-sm text-gold hover:text-white underline font-bold transition-colors">
              সব ক্যাটাগরি দেখুন ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasons.map(s => (
            <button key={s.id} onClick={() => setActiveSeason(s.id)}
              className={`px-7 py-3 rounded-full font-black transition-all duration-300 border-2 text-[10px] uppercase tracking-widest ${
                activeSeason === s.id
                  ? 'bg-gold border-gold text-darkGreen shadow-[0_10px_20px_rgba(235,180,85,0.3)]'
                  : 'bg-transparent border-white/10 text-white hover:border-gold hover:text-gold'
              }`}>
              {s.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((p, index) => (
            <ProductCard key={p.id} product={p} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
