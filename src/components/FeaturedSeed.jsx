import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function FeaturedSeed() {
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    api.get('products/')
      .then(res => {
        const sorghum = res.data.find(p => p.name.includes('সর্গাম'));
        if (sorghum) setProductId(sorghum.id);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="py-24 bg-midGreen text-white">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative flex justify-center w-full"
          >
            {/* Background Gold Square */}
            <div className="absolute top-8 left-0 lg:left-8 w-64 h-64 bg-gold rounded-lg z-0"></div>
            <img 
              src="/sorghum.jpg" 
              alt="Sorghum Sudan Seeds" 
              className="relative z-10 w-full max-w-md rounded-xl shadow-2xl border-4 border-midGreen"
              onError={(e) => { e.target.onerror = null; e.target.src = '/cat2.jpg'; }}
            />
            {/* Price Tag overlapping */}
            <div className="absolute bottom-10 -right-4 md:right-10 lg:-right-4 bg-lightGreen p-6 rounded-xl shadow-xl z-20 border border-gold/30">
              <p className="text-3xl font-bold text-gold">৳৩০০</p>
              <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest font-semibold">প্রতি কেজি মূল্য</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          >
            <p className="text-gold uppercase tracking-widest text-xs font-bold mb-4">আমাদের বিশেষ বীজ</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              উচ্চ ফলনশীল <br/> সর্গাম সুদান
            </h2>
            <p className="text-gold font-bold mb-6 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-gold block"></span>
              গবাদিপশুর জন্য আদর্শ খাদ্য
            </p>
            <p className="text-textSoft mb-10 leading-relaxed font-light text-lg">
              সর্গাম সুদান একটি উচ্চ পুষ্টিগুণ সম্পন্ন গবাদিপশুর খড় ও ঘাস। এটি অত্যন্ত খরা সহনশীল, দ্রুত বৃদ্ধি পায় এবং একবার রোপনে কয়েকবার ফসল কাটা যায়। আপনার খামারের পুষ্টি চাহিদা মেটাতে এটি একটি যুগান্তকারী সমাধান।
            </p>
            
            <ul className="space-y-4 mb-12">
              <li className="flex items-center gap-4 text-white">
                <span className="w-6 h-6 rounded-full bg-gold text-darkGreen flex items-center justify-center text-xs font-bold">✓</span> 
                সার্টিফাইড অর্গানিক বীজ
              </li>
              <li className="flex items-center gap-4 text-white">
                <span className="w-6 h-6 rounded-full bg-gold text-darkGreen flex items-center justify-center text-xs font-bold">✓</span> 
                উচ্চ পুষ্টিগুণ এবং প্রোটিন সমৃদ্ধ ঘাস
              </li>
              <li className="flex items-center gap-4 text-white">
                <span className="w-6 h-6 rounded-full bg-gold text-darkGreen flex items-center justify-center text-xs font-bold">✓</span> 
                খরা সহনশীল এবং অধিক ফলনশীল
              </li>
            </ul>

            <button 
              onClick={() => {
                if (productId) {
                  navigate(`/product/${productId}`);
                } else {
                  alert("পণ্যটি এই মুহূর্তে ডাটাবেস এ নেই।");
                }
              }} 
              disabled={!productId}
              className={`bg-transparent border-2 border-gold text-gold px-8 py-3 rounded-md transition-colors font-bold flex items-center gap-2 ${productId ? 'hover:bg-gold hover:text-darkGreen' : 'opacity-50 cursor-not-allowed'}`}
            >
              <ShoppingCart className="w-5 h-5 text-current" />
              {productId ? 'কার্টে যোগ করুন' : 'লোড হচ্ছে...'}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
