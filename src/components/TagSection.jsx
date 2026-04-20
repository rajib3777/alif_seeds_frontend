import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import api from '../api';

export default function TagSection({ tagName, title, subtitle }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('products/')
      .then(res => {
        // FLEXIBLE FILTERING: Match by name code OR bangla label
        const filtered = res.data.filter(p => {
            const tags = p.tags || [];
            return tags.some(t => {
                const n = t.name?.toLowerCase();
                const target = tagName.toLowerCase();
                return n.includes(target) || target.includes(n);
            });
        });
        
        // IF STILL EMPTY, TRY FALLBACK TO CHECK IF TAGS EXIST AT ALL
        if (filtered.length === 0) {
            const allTagsFound = res.data.flatMap(p => p.tags || []).map(t => t.name);
            setDebugInfo(`Available tags in API: ${[...new Set(allTagsFound)].join(', ')}`);
        }

        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setDebugInfo(`Connection Error: ${err.message}`);
        setLoading(false);
      });
  }, [tagName]);

  if (loading) return null;

  return (
    <section className="py-16 bg-darkGreen overflow-hidden border-t border-white/5 min-h-[300px]">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-black">{subtitle}</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {title}
            </h2>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gold font-bold hover:text-white transition-colors group text-sm w-fit"
          >
            সবগুলো দেখুন <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Empty State / Debugging */}
        {products.length === 0 && (
            <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-12 text-center">
                <AlertCircle className="w-8 h-8 text-gold mx-auto mb-4" />
                <p className="text-white font-bold mb-2">এই সেকশনে বর্তমানে কোনো পণ্য নেই।</p>
                <div className="text-[10px] text-gray-500 uppercase flex flex-col gap-1">
                    <p>Target Tag: <span className="text-gold">{tagName}</span></p>
                    <p className="mt-2 text-gray-700 italic">{debugInfo}</p>
                </div>
            </div>
        )}

        {/* Products Row - Horizontal Scroll */}
        {products.length > 0 && (
            <div className="relative">
                <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth -mx-6 px-6">
                    {products.map((p, idx) => (
                    <div key={p.id} className="min-w-[240px] md:min-w-[300px] snap-start">
                        <ProductCard product={p} index={idx} />
                    </div>
                    ))}
                </div>
                {/* Fade effect on right */}
                <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-darkGreen to-transparent pointer-events-none hidden md:block"></div>
            </div>
        )}
      </div>
    </section>
  );
}
