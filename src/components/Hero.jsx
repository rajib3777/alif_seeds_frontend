import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight } from 'lucide-react';

const slides = [
  { src: "/carousel_1.png", label: "বাংলাদেশের ১ নম্বর অনলাইন সিড কোম্পানি" },
  { src: "/carousel_2.jpg", label: "রেড জোয়ার (সোরগাম সুদান গ্রাস)" },
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
    <div className="w-full bg-darkGreen px-2 lg:px-4 py-4 md:py-6 mb-8 sm:mb-12">
      <div className="container mx-auto max-w-[1500px]">
        {/* Full-Width Carousel Layout */}
        <div className="relative w-full h-[280px] sm:h-[450px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/5 bg-[#1B291C]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={slides[current].src}
                className="w-full h-full object-contain sm:object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = '/cat1.png'; }}
              />
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/30 to-transparent"></div>
            </motion.div>
          </AnimatePresence>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6 sm:px-16 lg:px-24">
            <motion.div
              key={`label-${current}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-xl sm:max-w-2xl"
            >
              <div className="flex items-center gap-2 sm:gap-3 text-gold mb-2 sm:mb-6">
                <div className="w-8 sm:w-12 h-[2px] bg-gold"></div>
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] sm:tracking-[0.4em]">Agricultural Excellence</span>
              </div>
              
              <h2 className="text-xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-4 sm:mb-8">
                {slides[current].label.split('(')[0]} 
                {slides[current].label.includes('(') && (
                   <span className="block text-gold text-lg sm:text-4xl mt-1 sm:mt-2 italic font-serif">
                     ({slides[current].label.split('(')[1]}
                   </span>
                )}
              </h2>

              <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-10">
                <Link to="/products" className="relative group px-5 py-2.5 sm:px-10 sm:py-5 overflow-hidden rounded-lg sm:rounded-xl bg-gold text-darkGreen font-black text-[10px] sm:text-base uppercase tracking-widest shadow-lg sm:shadow-[0_10px_30px_rgba(235,180,85,0.4)] transition-all">
                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    অর্ডার করুন
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform" />
                  </span>
                </Link>
                
                <Link to="/products" className="group px-5 py-2.5 sm:px-10 sm:py-5 rounded-lg sm:rounded-xl border border-white/40 text-white font-black text-[10px] sm:text-base uppercase tracking-widest backdrop-blur-md hover:bg-white hover:text-darkGreen transition-all flex items-center gap-2 sm:gap-3">
                  পণ্য দেখুন
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          {/* Left/Right Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-6 z-30 pointer-events-none">
            <button 
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/20 hover:bg-gold backdrop-blur-lg border border-white/10 text-white hover:text-darkGreen flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-50 sm:hover:opacity-100"
              onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button 
              className="pointer-events-auto w-12 h-12 rounded-full bg-black/20 hover:bg-gold backdrop-blur-lg border border-white/10 text-white hover:text-darkGreen flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-50 sm:hover:opacity-100"
              onClick={() => setCurrent((c) => (c + 1) % slides.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-10 right-10 flex gap-3 z-30">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-700 rounded-full h-1.5 ${current === i ? 'w-12 bg-gold shadow-[0_0_10px_rgba(235,180,85,0.8)]' : 'w-4 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>

          {/* Numbers Indicator */}
          <div className="absolute top-10 right-10 z-30 hidden sm:block">
            <div className="text-white/20 text-6xl font-black font-serif italic select-none">
              0{current + 1}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
