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
