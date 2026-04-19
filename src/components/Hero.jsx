import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { src: "/carousel_1.png", label: "প্রিমিয়াম সীডস ও এগ্রো সার্ভিস" },
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
    <div className="w-full bg-darkGreen px-2 lg:px-4 py-4">
      <div className="container mx-auto max-w-[1400px]">
        {/* Main Hero Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
          
          {/* Left Column: Carousel Slider (takes ~68% on large screen) */}
          <div className="w-full lg:w-[68%] relative h-[300px] sm:h-[400px] lg:h-full rounded overflow-hidden bg-white/5 group shadow-lg border border-white/10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={current}
                src={slides[current].src}
                className="absolute inset-0 w-full h-full object-contain"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                onError={(e) => { e.target.onerror = null; e.target.src = '/cat1.png'; }}
              />
            </AnimatePresence>

            {/* Subtle Gradient Overlay for Slide Label */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-10 left-8 z-10">
              <span className="bg-gold text-darkGreen px-4 py-1.5 rounded-sm font-bold text-lg shadow-md uppercase tracking-wide inline-block mb-2">
                {slides[current].label}
              </span>
            </div>

            {/* Left/Right Arrows */}
            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10" onClick={() => setCurrent((c) => (c + 1) % slides.length)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${current === i ? 'w-8 h-2 bg-gold' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Promotional Banner (takes ~32% on large screen) */}
          <div className="w-full lg:w-[32%] relative h-[300px] lg:h-full rounded overflow-hidden bg-white/5 shadow-lg border border-gold/30 flex items-center justify-center hover:shadow-[0_0_20px_rgba(235,180,85,0.2)] transition-shadow">
             <img 
               src="/cabbage_poster.jpg" 
               alt="Special Promotional Offer"
               className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
               onError={(e) => { e.target.style.display = 'none'; }}
             />
          </div>

        </div>
      </div>
    </div>
  );
}
