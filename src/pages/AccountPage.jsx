import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const MOCK_ORDERS = [
  { id: 'ORD-1081', date: '১৮ এপ্রিল, ২০২৬', items: 'ভুট্টার বীজ ×১, পেঁপে বীজ ×২', total: '৫৫০', status: 'ডেলিভারি সম্পন্ন', discount: '৫৫' },
  { id: 'ORD-1074', date: '১৫ এপ্রিল, ২০২৬', items: 'বোরো ধানের বীজ ×৫', total: '১,২০০', status: 'প্রক্রিয়াধীন', discount: '১২০' },
  { id: 'ORD-1063', date: '১০ এপ্রিল, ২০২৬', items: 'হাইব্রিড টমেটো বীজ ×৩', total: '৮৪০', status: 'ডেলিভারি সম্পন্ন', discount: '৮৪' },
];

const statusColors = {
  'ডেলিভারি সম্পন্ন': 'bg-green-500/20 text-green-300 border-green-500/30',
  'প্রক্রিয়াধীন': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'বাতিল': 'bg-red-500/20 text-red-300 border-red-500/30',
};

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuthStore();
  const cart = useCartStore(s => s.cart);
  const navigate = useNavigate();

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-darkGreen flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-2">লগইন প্রয়োজন</h2>
        <p className="text-gray-400 mb-6">একাউন্ট দেখতে আগে লগইন করুন</p>
        <div className="flex gap-4">
          <Link to="/login" className="bg-gold text-[#112a1f] font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition shadow-lg">লগইন করুন</Link>
          <Link to="/signup" className="border border-gold text-gold font-bold px-6 py-3 rounded-lg hover:bg-gold/10 transition">নিবন্ধন করুন</Link>
        </div>
        {/* Discount promo */}
        <div className="mt-8 bg-gold/10 border border-gold/30 rounded-xl p-5 max-w-sm">
          <p className="text-gold font-bold text-base mb-1">🎉 এখনই যোগ দিন</p>
          <p className="text-gray-300 text-sm">একাউন্ট থাকলে প্রতিটি অর্ডারে <strong className="text-gold">১০% – ২০% ডিসকাউন্ট</strong> পাবেন!</p>
        </div>
      </div>
    );
  }

  const totalSaved = MOCK_ORDERS.reduce((s, o) => s + parseInt(o.discount.replace(',', '')), 0);

  return (
    <div className="min-h-screen bg-darkGreen pb-20 lg:pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0d2117] to-[#1a4a2e] border-b border-gold/20 px-4 py-8">
        <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center text-4xl shadow-lg flex-shrink-0">
            👤
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">📱 {user.phone}</p>
            <span className="mt-2 inline-block bg-gold/20 border border-gold/40 text-gold text-xs font-bold px-3 py-1 rounded-full">
              ✨ প্রিমিয়াম সদস্য — প্রতি অর্ডারে ১০% ছাড়
            </span>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            className="text-sm text-red-400 hover:text-red-300 border border-red-400/40 px-4 py-2 rounded-lg hover:bg-red-500/10 transition font-semibold">
            লগআউট
          </button>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stats */}
        {[
          { label: 'মোট অর্ডার', value: MOCK_ORDERS.length + 'টি', icon: '📦' },
          { label: 'কার্টে আইটেম', value: totalItems + 'টি', icon: '🛒' },
          { label: 'সাশ্রয় হয়েছে', value: '৳' + totalSaved, icon: '💰' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</p>
              <p className="text-white font-bold text-xl">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Banner */}
      <div className="container mx-auto max-w-4xl px-4 mt-5">
        <div className="bg-gradient-to-r from-gold/20 to-yellow-600/10 border border-gold/40 rounded-xl p-4 flex items-center gap-4">
          <div className="text-3xl">🏷️</div>
          <div>
            <p className="text-gold font-bold text-sm">আপনার একাউন্ট ডিসকাউন্ট সক্রিয়!</p>
            <p className="text-gray-300 text-xs mt-0.5">প্রতিটি অর্ডারে স্বয়ংক্রিয়ভাবে <strong className="text-gold">১০% ছাড়</strong> প্রযোজ্য হবে। বড় অর্ডারে (৫কেজি+) সর্বোচ্চ <strong className="text-gold">২০% ছাড়</strong>!</p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="container mx-auto max-w-4xl px-4 mt-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-gold rounded-full"></span>
          অর্ডার হিস্ট্রি
        </h2>
        <div className="flex flex-col gap-3">
          {MOCK_ORDERS.map(order => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-gold/20 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gold font-bold text-sm">{order.id}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status] || 'bg-white/10 text-gray-300 border-white/20'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{order.items}</p>
                  <p className="text-gray-500 text-xs mt-1">📅 {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">৳ {order.total}</p>
                  <p className="text-green-400 text-xs font-semibold">সাশ্রয়: ৳ {order.discount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link to="/products" className="bg-gold text-[#112a1f] font-bold py-3 rounded-xl text-center hover:bg-yellow-300 transition shadow-lg text-sm">
            🌿 পণ্য দেখুন
          </Link>
          <Link to="/cart" className="bg-white/10 border border-white/20 text-white font-bold py-3 rounded-xl text-center hover:bg-white/20 transition text-sm">
            🛒 কার্ট দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}
