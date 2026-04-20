import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Zap, CheckCircle2, Gift, ThumbsUp, Crown, RefreshCw, MessageCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const TagIcon = ({ tag }) => {
  const iconClass = "w-3 h-3";
  const name = tag?.toLowerCase() || '';
  if (name.includes('twelve') || name.includes('মাস')) return <RefreshCw className={iconClass} />;
  if (name.includes('tested') || name.includes('পরিক্ষিত')) return <CheckCircle2 className={iconClass} />;
  if (name.includes('special') || name.includes('সেরা')) return <Crown className={iconClass} />;
  if (name.includes('uncommon') || name.includes('আনকমন')) return <Zap className={iconClass} />;
  if (name.includes('offer') || name.includes('অফার')) return <Gift className={iconClass} />;
  if (name.includes('popular') || name.includes('পপুলার')) return <ThumbsUp className={iconClass} />;
  return <Star className={iconClass} />;
};

const getLabel = (name) => {
  const labels = {
    'TwelveMonth': '১২ মাস', '১২ মাস': '১২ মাস',
    'Tested': 'পরিক্ষিত', 'পরিক্ষিত': 'পরিক্ষিত',
    'Special': 'সেরা পণ্য', 'সেরা পণ্য': 'সেরা পণ্য',
    'Uncommon': 'আনকমন', 'আনকমন': 'আনকমন',
    'Offer': 'অফার', 'অফার': 'অফার',
    'Popular': 'পপুলার', 'পপুলার': 'পপুলার',
    'New': 'নতুন পণ্য', 'নতুন': 'নতুন পণ্য'
  };
  return labels[name] || name;
};

const getColor = (name) => {
  const colors = {
    'TwelveMonth': 'bg-blue-600', '১২ মাস': 'bg-blue-600',
    'Tested': 'bg-green-600', 'পরিক্ষিত': 'bg-green-600',
    'Special': 'bg-teal-600', 'সেরা পণ্য': 'bg-teal-600',
    'Uncommon': 'bg-red-600', 'আনকমন': 'bg-red-600',
    'Offer': 'bg-orange-600', 'অফার': 'bg-orange-600',
    'Popular': 'bg-green-800', 'পপুলার': 'bg-green-800',
    'New': 'bg-green-700', 'নতুন': 'bg-green-700'
  };
  return colors[name] || 'bg-red-500';
};

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

export default function ProductCard({ product, index }) {
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);

  const tags = product.tags || [];
  const cashback = product.cashback_amount !== undefined ? parseFloat(product.cashback_amount) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: (index % 4) * 0.05 }}
      viewport={{ once: true }}
      className="bg-midGreen rounded-xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col h-full border border-white/10 group relative"
    >
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#0d2118]">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image || '/cat2.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { e.target.onerror = null; e.target.src = '/cat2.jpg'; }}
          />
        </Link>
        
        {/* TAGS & SEED LABEL - BOTTOM RIGHT */}
        <div className="absolute bottom-2 right-2 z-20 flex flex-wrap justify-end items-end gap-1.5 w-[90%] pointer-events-none">
            {/* Season Tag */}
            {product.season && (
                <div className={`${
                    product.season === 'Summer' ? 'bg-orange-500' : 
                    product.season === 'Winter' ? 'bg-cyan-600' : 'bg-emerald-600'
                } text-white flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black shadow-md uppercase border border-white/20 pointer-events-auto backdrop-blur-md`}>
                    {product.season === 'Summer' ? 'গ্রীষ্মকালীন' : 
                     product.season === 'Winter' ? 'শীতকালীন' : 'বারোমাসি'}
                </div>
            )}
            
            {/* Base tags aligned right to left */}
            {tags.map((t, idx) => (
                <div key={idx} className={`${getColor(t.name)} text-white flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black shadow-md uppercase border border-white/20 pointer-events-auto backdrop-blur-md`}>
                    <TagIcon tag={t.name} />
                    {getLabel(t.name)}
                </div>
            ))}
            
            {/* Fallback if product is special but tags failed */}
            {tags.length === 0 && product.is_special && (
                 <div className="bg-gold text-darkGreen flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black shadow-md border border-yellow-600 pointer-events-auto backdrop-blur-md">
                    <Star className="w-3 h-3 fill-current" />
                    সেরা বীজ
                </div>
            )}

            {/* Base Seed Label */}
            <div className="bg-darkGreen/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black text-gold border border-gold/30 shadow-md pointer-events-auto">
                বীজ
            </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <p className="text-[10px] text-gold uppercase font-black tracking-widest mb-1">{product.category_name || 'বীজ'}</p>
          <h3 className="text-white font-bold text-base md:text-lg mb-2 leading-tight group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Small text tags under title */}
        <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((t, idx) => (
                <span key={idx} className="text-[10px] font-black text-gold/80 italic">
                    #{getLabel(t.name)}
                </span>
            ))}
        </div>

        <p className="text-gray-400 text-[11px] mb-4 line-clamp-2 font-medium leading-relaxed opacity-80">
          {product.description}
        </p>

        {/* Price Area */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-gold">৳{parseFloat(product.price).toLocaleString()}</span>
            {product.original_price && parseFloat(product.original_price) > parseFloat(product.price) && (
              <span className="text-sm text-gray-500 line-through">৳{product.original_price}</span>
            )}
          </div>
          {cashback > 0 && (
            <div className="text-white/70 font-black text-[10px] flex items-center gap-1 bg-white/5 w-fit px-2 py-0.5 rounded mt-1 border border-white/5">
              <Gift className="w-3 h-3 text-gold" />
              ৳{cashback} ক্যাশব্যাক
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 mt-auto flex flex-col gap-2">
        <div className="flex flex-col min-[360px]:flex-row gap-2">
            <button
                onClick={(e) => { e.preventDefault(); addToCart(product); }}
                className="flex-1 h-10 bg-transparent border border-gold/50 text-gold rounded-lg font-bold text-[11px] leading-tight hover:bg-gold hover:text-darkGreen transition-all flex items-center justify-center text-center p-0"
            >
                কার্টে যোগ করুন
            </button>
            <a
                href={`https://wa.me/8801334642219?text=${encodeURIComponent(`আমি ${product.name} অর্ডার করতে চাই।`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-10 bg-[#25D366] text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 hover:bg-[#128C7E] transition-all shadow-md p-0"
            >
                <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                WhatsApp
            </a>
        </div>
        <button
          onClick={() => { addToCart(product); navigate('/cart'); }}
          className="w-full h-11 bg-gold text-darkGreen rounded-lg font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-yellow-400 hover:shadow-xl transition-all shadow-md animate-bounce"
        >
          <ShoppingCartIcon />
          অর্ডার করুন
        </button>
      </div>
    </motion.div>
  );
}
