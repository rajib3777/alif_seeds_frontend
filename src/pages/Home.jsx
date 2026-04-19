import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedSeed from '../components/FeaturedSeed';
import ProductGrid from '../components/ProductGrid';
import Testimonials from '../components/Testimonials';
import Features from '../components/Features';
import News from '../components/News';
import RecentOrders from '../components/RecentOrders';
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

function FreeDeliveryBanner() {
  return (
    <section className="bg-darkGreen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gold group cursor-pointer"
        >
          <img 
            src="/free-delivery-banner.png" 
            alt="5KG এর উপরে অর্ডারে ফ্রি ডেলিভারি" 
            className="w-full h-auto max-h-[400px] object-cover group-hover:scale-105 transition duration-700"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-darkGreen/80 to-transparent flex items-end p-8">
            <h3 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              ৫ কেজি এর উপরে অর্ডারে <span className="text-gold">ফ্রি ডেলিভারি!</span>
            </h3>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <RecentOrders />
      <Categories />
      <FeaturedSeed />
      <ProductGrid />
      <ParallaxBanner />
      <Testimonials />
      <Features />
      <News />
    </>
  );
}
