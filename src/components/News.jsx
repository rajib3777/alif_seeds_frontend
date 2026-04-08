import { motion } from 'framer-motion';

const articles = [
  { id: 1, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600", title: "Taking seamless key indicators offline to maximise" },
  { id: 2, img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600", title: "Override the digital divide with additional clicks" },
  { id: 3, img: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=600", title: "Agriculture Matters to the future of real farming" },
]

export default function News() {
  return (
    <section className="py-24 bg-darkGreen text-white border-t border-gray-800 relative z-10">
      <div className="container mx-auto px-8 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-3 font-semibold">FROM THE BLOG</p>
          <h2 className="text-4xl font-bold text-white uppercase tracking-wider">News & Articles</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {articles.map((article, i) => (
             <motion.div 
               key={article.id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1, duration: 0.6 }}
               viewport={{ once: true }}
               className="bg-midGreen rounded-xl overflow-hidden group cursor-pointer shadow-xl border border-gray-700/50"
             >
               <div className="h-56 overflow-hidden relative">
                 <img src={article.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100" />
                 <div className="absolute bottom-4 right-4 bg-gold text-darkGreen px-4 py-1.5 rounded text-xs font-bold shadow-md">24 May 2026</div>
               </div>
               <div className="p-8">
                 <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-semibold uppercase tracking-widest">
                   <span className="flex items-center gap-1">👤 Admin</span>
                   <span className="flex items-center gap-1">💬 0 Comments</span>
                 </div>
                 <h4 className="text-xl font-bold hover:text-gold transition leading-snug">{article.title}</h4>
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
