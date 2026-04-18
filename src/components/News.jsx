import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../api';

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('articles/')
      .then(res => {
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Articles fetch error:', err);
        setLoading(false);
      });
  }, []);

  if (!loading && articles.length === 0) return null;

  return (
    <section className="py-24 bg-darkGreen text-white border-t border-gray-800 relative z-10">
      <div className="container mx-auto px-8 max-w-6xl">
        <div className="text-center mb-16">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-3 font-semibold text-gold">ব্লগ থেকে</p>
          <h2 className="text-4xl font-bold text-white tracking-wider">খবর ও নিবন্ধ</h2>
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-midGreen rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {articles.map((article, i) => (
             <motion.div 
               key={article.id}
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1, duration: 0.6 }}
               viewport={{ once: true }}
               className="bg-midGreen rounded-xl overflow-hidden group cursor-pointer shadow-xl border border-gray-700/50 flex flex-col"
             >
               <div className="h-56 overflow-hidden relative">
                 <img 
                    src={article.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600"} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 opacity-90 group-hover:opacity-100" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=600"; }}
                 />
                 <div className="absolute bottom-4 right-4 bg-gold text-darkGreen px-4 py-1.5 rounded text-xs font-bold shadow-md">
                    {new Date(article.created_at).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                 </div>
               </div>
               <div className="p-8 flex-1 flex flex-col">
                 <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-semibold uppercase tracking-widest">
                   <span className="flex items-center gap-1">👤 এডমিন</span>
                   <span className="flex items-center gap-1">💬 ০ মন্তব্য</span>
                 </div>
                 <h4 className="text-xl font-bold hover:text-gold transition leading-snug mb-4">{article.title}</h4>
                 <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                    {article.content}
                 </p>
                 <div className="mt-auto">
                    <span className="text-gold text-sm font-bold border-b border-gold/40 pb-1 hover:border-gold transition">আরও পড়ুন →</span>
                 </div>
               </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
