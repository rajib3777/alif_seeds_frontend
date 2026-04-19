import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const STATUS_STEPS = [
  { id: 'Pending', label: 'পেন্ডিং', icon: '📝', color: 'bg-amber-500' },
  { id: 'Processing', label: 'প্রসেসিং', icon: '⚙️', color: 'bg-blue-500' },
  { id: 'Shipped', label: 'শিপড্', icon: '🚚', color: 'bg-indigo-500' },
  { id: 'Delivered', label: 'ডেলিভারি সম্পন্ন', icon: '✅', color: 'bg-green-500' },
];

export default function TrackOrder() {
  const [form, setForm] = useState({ orderId: '', phone: '' });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!form.orderId || !form.phone) {
      setError('অর্ডার আইডি এবং ফোন নম্বর দিন');
      return;
    }
    setError('');
    setLoading(true);
    setOrder(null);
    try {
      const res = await api.get(`orders/track/`, {
        params: { order_id: form.orderId, phone: form.phone }
      });
      setOrder(res.data);
    } catch (err) {
      setError(err?.response?.data?.error || 'অর্ডারটি খুঁজে পাওয়া যায়নি। সঠিক তথ্য দিন।');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? STATUS_STEPS.findIndex(s => s.id === order.status) : -1;

  return (
    <div className="min-h-screen bg-darkGreen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4">অর্ডার ট্র্যাক করুন</h1>
          <p className="text-gray-300">আপনার অর্ডারের বর্তমান অবস্থা জানতে তথ্য দিন</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 mb-10 shadow-2xl">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-1">অর্ডার আইডি</label>
              <input 
                type="text" 
                placeholder="Ex: 123"
                value={form.orderId}
                onChange={e => setForm(f => ({...f, orderId: e.target.value}))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-400 text-xs font-bold uppercase mb-2 ml-1">ফোন নম্বর</label>
              <input 
                type="tel" 
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold transition"
              />
            </div>
            <div className="md:self-end">
              <button 
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gold text-darkGreen font-extrabold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50"
              >
                {loading ? 'তথ্য খোঁজা হচ্ছে...' : '🔍 ট্র্যাক করুন'}
              </button>
            </div>
          </form>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>

        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-gold/20 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10 gap-4">
                <div>
                  <p className="text-gray-400 text-sm uppercase font-bold tracking-widest">Order ID: #{order.id}</p>
                  <h2 className="text-2xl font-bold text-white mt-1">{order.name}</h2>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">অর্ডারের তারিখ</p>
                  <p className="text-white font-bold">{new Date(order.created_at).toLocaleDateString('bn-BD')}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative mb-16 pt-10 px-4">
                {/* Connector Line */}
                <div className="absolute top-[68px] left-8 right-8 h-1 bg-white/10 z-0 hidden md:block"></div>
                <div 
                  className="absolute top-[68px] left-8 h-1 bg-gold z-0 transition-all duration-1000 hidden md:block"
                  style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                ></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isActive = idx === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 text-center">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-500 ${isCompleted ? 'bg-gold' : 'bg-white/10 grayscale opacity-40'} ${isActive ? 'ring-4 ring-gold/30 scale-110' : ''}`}>
                          {step.icon}
                        </div>
                        <div className="text-left md:text-center">
                          <p className={`font-bold mt-2 ${isCompleted ? 'text-white' : 'text-gray-500'}`}>{step.label}</p>
                          {isActive && <div className="text-[10px] bg-gold text-darkGreen px-2 py-0.5 rounded-full font-bold inline-block mt-1 animate-pulse">বর্তমান অবস্থা</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-gold font-bold mb-4 flex items-center gap-2">
                    <span>📦</span> পণ্য তালিকা:
                  </h3>
                  <ul className="space-y-3">
                    {order.items?.map((item, i) => (
                      <li key={i} className="flex justify-between text-sm text-gray-300">
                        <span>{item.product_name} x {item.quantity}</span>
                        <span className="text-white font-bold">৳{item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between font-bold text-white">
                    <span>মোট:</span>
                    <span className="text-gold">৳{order.total_price}</span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-2xl p-6 border border-white/5">
                  <h3 className="text-gold font-bold mb-4 flex items-center gap-2">
                    <span>📍</span> ডেলিভারি ঠিকানা:
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {order.address}
                    <br/><br/>
                    Zone: {order.delivery_zone}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
