import { motion } from 'framer-motion';

export default function Features() {
  return (
    <section className="py-24 bg-lightGreen text-white overflow-hidden relative border-t-8 border-gold">
      <div className="absolute right-0 top-0 w-2/3 h-full bg-darkGreen opacity-30 transform skew-x-12 translate-x-20"></div>
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
           <motion.div 
             className="md:w-1/2"
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
              <div className="relative border border-gold/50 rounded-xl overflow-hidden shadow-2xl p-2 bg-darkGreen transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800" className="w-full h-auto rounded-lg mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" alt="Features" />
              </div>
           </motion.div>
           <motion.div 
             className="md:w-1/2"
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
             <p className="text-gold uppercase tracking-widest text-xs font-bold mb-4">MODERN AGRICULTURE</p>
             <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight border-b border-white/20 pb-6 uppercase">
                Providing High Quality<br/>Products
             </h2>
             
             <div className="space-y-8">
               <motion.div whileHover={{ x: 10 }} className="flex gap-6 transition-transform">
                 <div className="w-16 h-16 rounded flex-shrink-0 bg-darkGreen text-gold flex items-center justify-center text-3xl shadow-lg border border-gold/30">🌱</div>
                 <div>
                   <h4 className="text-2xl font-bold mb-2">Our Agriculture Growth</h4>
                   <p className="text-gray-200 text-base leading-relaxed">অর্গানিক বীজ এবং প্রাকৃতিক চাষাবাদের মাধ্যমে আমরা কৃষির আধুনিকীকরণ করছি যা নিরাপদ ও স্বাস্থ্যকর।</p>
                 </div>
               </motion.div>
               <motion.div whileHover={{ x: 10 }} className="flex gap-6 transition-transform">
                 <div className="w-16 h-16 rounded flex-shrink-0 bg-darkGreen text-gold flex items-center justify-center text-3xl shadow-lg border border-gold/30">⚙️</div>
                 <div>
                   <h4 className="text-2xl font-bold mb-2">Modern Farming Needs</h4>
                   <p className="text-gray-200 text-base leading-relaxed">উন্নত যন্ত্রপাতি ও প্রযুক্তির সঠিক ব্যবহারে ফসলের ফলন নিশ্চিতকরণ এবং কৃষকের অর্থনৈতিক সমৃদ্ধি।</p>
                 </div>
               </motion.div>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
