import { motion } from 'framer-motion';
import { useSearchStore } from '../store/useSearchStore';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { ArrowRight } from 'lucide-react';

export default function Categories() {
  const setCategory = useSearchStore(state => state.setCategory);
  const navigate = useNavigate();

  const handleCategoryClick = (label) => {
    setCategory(label);
    navigate('/products');
  };

  // Limit items for homepage
  const displayedCategories = CATEGORIES.slice(0, 6);

  return (
    <section id="categories" className="py-16 bg-[#1B291C] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2 font-semibold">সবচেয়ে জনপ্রিয় বীজসমূহ</p>
          <h2 className="text-3xl font-bold text-white">ক্যাটাগরি অনুযায়ী পণ্য দেখুন</h2>
          <div className="w-16 h-1 bg-gold mx-auto mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {displayedCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              onClick={() => handleCategoryClick(cat.label)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden cursor-pointer group border ${cat.border} shadow-lg hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_8px_25px_rgba(235,180,85,0.25)] aspect-[3/4]`}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute inset-0 flex flex-col justify-between p-3">
                <div className="self-end">
                  <span className="bg-gold text-[#112a1f] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    {cat.count}
                  </span>
                </div>
                <div>
                  <div className="text-2xl mb-1 drop-shadow-lg">{cat.icon}</div>
                  <p className="font-bold text-white text-sm leading-tight drop-shadow-lg group-hover:text-gold transition-colors">{cat.label}</p>
                  <p className="text-gray-300 text-[10px] mt-0.5 group-hover:text-gold/80 transition-colors">দেখুন →</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/all-categories')}
            className="flex items-center gap-3 bg-gold text-darkGreen px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:bg-yellow-400 transition-colors"
          >
            সবগুলো ক্যাটাগরি দেখুন
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
