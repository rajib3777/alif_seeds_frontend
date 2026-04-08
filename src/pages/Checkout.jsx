import { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import api from '../api';

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [errors, setErrors] = useState({});

  const total = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'নাম প্রয়োজন';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'সঠিক ফোন নম্বর দিন';
    if (!form.address.trim()) e.address = 'ঠিকানা প্রয়োজন';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        address: form.address,
        total_price: total,
        items: cart.map(item => ({ product: item.product.id, quantity: item.quantity }))
      };

      await api.post('orders/', payload);

      setSuccess(true);
      clearCart();
    } catch (err) {
      alert('দুঃখিত, অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-darkGreen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center py-20 max-w-lg px-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-28 h-28 bg-green-500/20 border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <svg className="w-14 h-14 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-4">অর্ডার সফল হয়েছে! 🎉</h2>
          <p className="text-gray-300 mb-4 text-lg leading-relaxed">
            আপনাকে আন্তরিক ধন্যবাদ! আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
          </p>
          <div className="bg-midGreen rounded-xl p-6 mb-8 text-left border border-white/10">
            <p className="text-gold font-bold mb-2">অর্ডারের তথ্য:</p>
            <p className="text-gray-300"><span className="text-white font-semibold">নাম:</span> {form.name}</p>
            <p className="text-gray-300"><span className="text-white font-semibold">ফোন:</span> {form.phone}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-gold text-darkGreen px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-lg hover:scale-105"
          >
            হোমপেজে ফিরে যান
          </button>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-darkGreen flex items-center justify-center text-center px-4">
        <div>
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-white mb-4">কার্ট খালি!</h2>
          <Link to="/" className="bg-gold text-darkGreen px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition">
            বীজ কিনতে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkGreen py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white mb-10 border-b border-gray-700 pb-4"
        >
          চেকআউট
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* FORM */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-gold mb-6 uppercase tracking-wider">ডেলিভারি তথ্য</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-gray-300 font-bold mb-2">আপনার নাম *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className={`w-full px-4 py-3 bg-midGreen border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold transition ${errors.name ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="যেমন: আব্দুল্লাহ আল মামুন"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-2">ফোন নম্বর *</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({...form, phone: e.target.value})}
                  className={`w-full px-4 py-3 bg-midGreen border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold transition ${errors.phone ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="01XXX-XXXXXX"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-2">ডেলিভারি ঠিকানা *</label>
                <textarea
                  rows="4"
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className={`w-full px-4 py-3 bg-midGreen border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold transition resize-none ${errors.address ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা..."
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="bg-midGreen/50 rounded-xl p-4 border border-gold/20">
                <p className="text-gold font-bold text-sm mb-1">💳 পেমেন্ট পদ্ধতি</p>
                <p className="text-gray-300 text-sm">ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-darkGreen py-5 rounded-xl font-bold text-xl hover:bg-yellow-400 transition-all shadow-[0_4px_20px_rgba(235,180,85,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    প্রসেস হচ্ছে...
                  </span>
                ) : '✓ অর্ডার কনফার্ম করুন'}
              </button>
            </form>
          </motion.div>

          {/* ORDER SUMMARY */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl font-bold text-gold mb-6 uppercase tracking-wider">অর্ডার সামারি</h2>
            <div className="bg-midGreen rounded-2xl overflow-hidden border border-white/10 shadow-xl">
              <div className="divide-y divide-gray-700">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-4 p-5">
                    <img
                      src={item.product.image || '/cat2.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-gold/20"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/sorghum.jpg'; }}
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                      <p className="text-gray-400 text-xs mt-1">পরিমাণ: {item.quantity} কেজি</p>
                    </div>
                    <div className="font-bold text-gold">৳{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-darkGreen/50 border-t border-gray-700">
                <div className="flex justify-between items-center text-gray-400 mb-2">
                  <span>সাবটোটাল</span>
                  <span className="text-white">৳{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 mb-4">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="text-green-400 font-bold">বিনামূল্যে</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                  <span className="text-xl font-bold text-white">সর্বমোট</span>
                  <span className="text-3xl font-bold text-gold">৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link to="/cart" className="block mt-4 text-center text-gray-400 hover:text-gold transition text-sm">
              ← কার্টে ফিরে যান
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
