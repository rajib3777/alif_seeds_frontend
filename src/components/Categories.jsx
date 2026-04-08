import { motion } from 'framer-motion';

const categories = [
  { id: 1, name: 'ধান', icon: '🌾' },
  { id: 2, name: 'গম', icon: '🌾' },
  { id: 3, name: 'ভুট্টা', icon: '🌽' },
  { id: 4, name: 'সবজি', icon: '🥕' },
  { id: 5, name: 'ফল', icon: '🍎' },
];

export default function Categories() {
  return (
    <section id="categories" className="py-24 bg-[#1B291C] text-white text-center">
      <div className="container mx-auto px-4">
        <p className="text-gray-400 uppercase tracking-widest text-xs mb-3 font-semibold">সবচেয়ে জনপ্রিয় বীজসমূহ</p>
        <h2 className="text-3xl font-bold mb-16 text-white">মানসম্মত শস্য ও সবজি ক্যাটাগরি</h2>
        
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-lightGreen/20 w-32 h-32 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-lightGreen/50 hover:-translate-y-2 transition-all border border-green-800/30 shadow-lg"
            >
              <div className="text-4xl mb-3 drop-shadow-md">{cat.icon}</div>
              <p className="font-bold text-sm text-gray-200">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
