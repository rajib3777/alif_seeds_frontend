import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';
import api from '../api';

export default function FeaturedSeed() {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('products/')
      .then(res => {
        const special = res.data.filter(p => p.is_special);
        setSpecialProducts(special);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="py-24 bg-midGreen text-center text-gold font-bold animate-pulse uppercase tracking-[0.3em]">
      জনপ্রিয় পণ্য লোড হচ্ছে...
    </div>
  );

  if (specialProducts.length === 0) return null;

  return (
    <section className="py-24 bg-midGreen relative overflow-hidden border-t border-white/5">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-gold mb-4"
            >
              <div className="w-12 h-[2px] bg-gold"></div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">bishesh bij</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white leading-tight"
            >
              জনপ্রিয় পণ্যসমূহ
            </motion.h2>
          </div>

          <motion.button 
            onClick={() => window.scrollTo({ top: document.getElementById('products')?.offsetTop - 100, behavior: 'smooth' })}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-gold font-bold hover:text-white transition-colors group"
          >
            সবগুলো দেখুন <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {specialProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
