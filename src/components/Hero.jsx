import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { src: "/seed_rice.png",  label: "ধানের বীজ" },
  { src: "/seed_wheat.png", label: "গমের বীজ" },
  { src: "/seed_corn.png",  label: "ভুট্টার বীজ" },
  { src: "/seed_veg.png",   label: "সবজির বীজ" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen min-h-[700px] w-full overflow-hidden bg-darkGreen">
      <AnimatePresence mode="wait">
        <motion.img 
          key={current}
          src={slides[current].src}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      {/* Subtle dark overlay ONLY at bottom for text safety */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
      {/* Left side text area subtle bg */}
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/50 to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="container mx-auto px-8 relative z-10 h-full flex items-center pt-20">
        <div className="max-w-xl">
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-gold font-bold uppercase tracking-widest text-sm mb-4"
          >
             অরিজিনাল এবং প্রাকৃতিক — {slides[current].label}
          </motion.p>
          <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8"
          >
            কৃষিই ভবিষ্যৎ <br/> উন্নত ফলন
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg"
          >
            সেরা মানের বীজ থেকে উৎপন্ন হয় সেরা ফসল। আপনার খামারের পুষ্টি ও সমৃদ্ধির জন্য বেছে নিন আমাদের পরীক্ষিত কৃষি বীজ।
          </motion.p>
          <motion.button 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.8 }}
             className="bg-gold text-darkGreen px-8 py-4 rounded font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_4px_20px_rgba(235,180,85,0.4)]"
          >
            বিস্তারিত দেখুন
          </motion.button>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${current === i ? 'w-8 h-3 bg-gold' : 'w-3 h-3 bg-white/40 hover:bg-white/70'}`}
          />
        ))}
      </div>
    </div>
  );
}
