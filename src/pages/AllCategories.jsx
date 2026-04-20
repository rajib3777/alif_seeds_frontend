import { motion } from 'framer-motion';
import { CATEGORIES } from '../data/categories';
import { useSearchStore } from '../store/useSearchStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function AllCategories() {
  const setCategory = useSearchStore(state => state.setCategory);
  const navigate = useNavigate();

  const handleCategoryClick = (label) => {
    setCategory(label);
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-darkGreen">
      {/* Hero Header */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-darkGreen/50 via-darkGreen to-darkGreen"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gold font-bold mb-8 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="w-5 h-5" /> হোম-এ ফিরে যান
          </button>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            সবগুলো <span className="text-gold">বীজ ক্যাটাগরি</span>
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            আলিপ সীডস কোম্পানির সকল প্রকার উন্নত মানের সবজি, ফল, ফুল এবং ফসলের বীজ এখানে খুঁজে পাবেন। ক্যাটাগরি অনুযায়ী পছন্দমতো সেরা বীজ বেছে নিন।
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-midGreen rounded-3xl overflow-hidden border border-white/5 flex flex-col shadow-2xl hover:border-gold/30 transition-all group"
              >
                {/* Image & Header */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.label} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-60`}></div>
                  <div className="absolute inset-0 p-6 flex items-end justify-between">
                    <div>
                      <span className="text-4xl mb-2 block">{cat.icon}</span>
                      <h2 className="text-2xl font-bold text-white uppercase group-hover:text-gold transition-colors">{cat.label}</h2>
                    </div>
                    <span className="bg-gold text-darkGreen px-3 py-1 rounded-full text-[10px] font-black">{cat.count} পণ্য</span>
                  </div>
                </div>

                {/* Sub-categories or Action */}
                <div className="p-6 flex-1 flex flex-col">
                  {cat.subs ? (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cat.subs.map((sub, i) => (
                        <button 
                          key={i}
                          onClick={() => handleCategoryClick(sub)}
                          className="bg-white/5 hover:bg-gold hover:text-darkGreen px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm mb-6 flex-1">
                      {cat.label} এর সকল উন্নত জাতের হাইব্রিড ও দেশি এবং বিদেশি বীজ সংগ্রহ করতে এখনই দেখুন।
                    </p>
                  )}

                  <button 
                    onClick={() => handleCategoryClick(cat.label)}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white hover:bg-gold hover:text-darkGreen transition-all flex items-center justify-center gap-2 group-hover:bg-gold/10"
                  >
                    সবগুলো দেখুন <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
