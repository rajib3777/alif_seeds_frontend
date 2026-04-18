import { useCartStore } from '../store/useCartStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-darkGreen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-white mb-4">আপনার কার্টি খালি!</h2>
          <p className="text-gray-400 mb-8">দয়া করে পণ্য যোগ করুন।</p>
          <Link to="/" className="bg-gold text-darkGreen px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg">
            বীজ কিনতে যান
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkGreen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-10 border-b border-gray-700 pb-4"
        >
          🛒 শপিং কার্ট
        </motion.h1>

        <div className="bg-midGreen rounded-2xl overflow-hidden shadow-2xl border border-white/5 divide-y divide-gray-700">
          {cart.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col sm:flex-row items-center p-6 gap-6"
            >
              {/* Product Image */}
              <div className="w-24 h-24 bg-darkGreen rounded-xl overflow-hidden flex-shrink-0 border border-gold/20">
                <img
                  src={item.product.image || '/cat2.jpg'}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/sorghum.jpg'; }}
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow text-center sm:text-left">
                <p className="text-gold text-xs uppercase font-bold tracking-widest mb-1">{item.product.category_name}</p>
                <h3 className="text-xl font-bold text-white">{item.product.name}</h3>
                <p className="text-gray-400 font-semibold mt-1">৳{parseFloat(item.product.price).toLocaleString()} / কেজি</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 bg-darkGreen rounded-xl p-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-gold bg-midGreen rounded-lg transition"
                >
                  <MinusIcon />
                </button>
                <span className="font-bold text-xl text-white w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:text-gold bg-midGreen rounded-lg transition"
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Line Total */}
              <div className="text-right sm:w-32">
                <p className="text-2xl font-bold text-gold">৳{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded-lg transition"
              >
                <TrashIcon />
              </button>
            </motion.div>
          ))}

          {/* Free Delivery Progress */}
          {(() => {
            const totalWeight = cart.reduce((sum, item) => sum + item.quantity, 0);
            const remaining = 5 - totalWeight;
            const progress = Math.min(100, (totalWeight / 5) * 100);
            
            return (
              <div className="p-6 bg-gold/5 border-t border-b border-gold/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                    </div>
                    <div>
                      {remaining > 0 ? (
                        <>
                          <p className="text-white font-bold">ফ্রি ডেলিভারি অফার!</p>
                          <p className="text-gold text-sm font-semibold">আর <span className="text-white text-lg underline decoration-gold/50">{remaining} কেজি</span> যোগ করলে ডেলিভারি চার্জ একদম ফ্রি!</p>
                        </>
                      ) : (
                        <>
                          <p className="text-green-400 font-bold text-lg flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                             অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন।
                          </p>
                          <p className="text-gray-300 text-sm">আপনার অর্ডারের ওজন ৫ কেজি অতিক্রম করেছে।</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-gold font-bold text-sm hidden md:block">
                     প্রোগ্রেস: {totalWeight.toFixed(1)} / ৫ কেজি
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-3 bg-darkGreen rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${remaining > 0 ? 'bg-gold' : 'bg-green-500'} shadow-[0_0_15px_rgba(235,180,85,0.3)]`}
                  />
                </div>
              </div>
            );
          })()}

          {/* Total Row */}
          <div className="p-6 bg-darkGreen/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-widest">মোট পণ্য: {cart.length} ধরন</p>
              <p className="text-2xl font-bold text-white mt-1">সর্বমোট বিল</p>
            </div>
            <span className="text-4xl font-bold text-gold">৳{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
          <Link to="/" className="text-center border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-bold hover:border-gold hover:text-gold transition">
            ← কেনাকাটা চালিয়ে যান
          </Link>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-gold text-darkGreen px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-[0_4px_20px_rgba(235,180,85,0.4)] hover:scale-105"
          >
            চেকআউট করুন →
          </button>
        </div>
      </div>
    </div>
  );
}
