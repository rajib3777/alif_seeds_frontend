import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedSeed from '../components/FeaturedSeed';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import News from '../components/News';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

function ParallaxBanner() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Sunset Agriculture" 
          className="w-full h-full object-cover attachment-fixed"
        />
        <div className="absolute inset-0 bg-darkGreen/60"></div>
      </div>
      
      <div className="container mx-auto px-8 relative z-10 text-white flex flex-col md:flex-row items-center justify-between w-full max-w-6xl">
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl mb-8 md:mb-0"
        >
          Agriculture Matters to the Future of Bangladesh
        </motion.h2>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition group"
        >
           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-darkGreen shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:bg-gold transition-colors">
             <Play fill="currentColor" className="w-8 h-8 ml-1" />
           </div>
           <span className="font-serif italic text-gold text-2xl drop-shadow-md">Watch Video</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedSeed />
      <Categories />
      <ParallaxBanner />
      <ProductGrid />
      <Testimonials />
      <Features />
      <News />
    </>
  );
}
