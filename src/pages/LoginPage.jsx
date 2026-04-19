import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';

export default function LoginPage() {
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone || !form.password) { setError('সব তথ্য দিন'); return; }
    setLoading(true);
    try {
      const res = await api.post('auth/login/', { phone: form.phone, password: form.password });
      login({ name: res.data.name || form.phone, phone: form.phone });
      navigate('/account');
    } catch (err) {
      const msg = err?.response?.data?.error;
      if (err?.response?.status === 404) {
        setError('এই নম্বরে কোনো একাউন্ট নেই। আগে অর্ডার করুন বা নিবন্ধন করুন।');
      } else {
        setError(msg || 'লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkGreen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(235,180,85,0.08) 0%, transparent 50%)' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Discount Banner */}
        <div className="bg-gradient-to-r from-gold/90 to-yellow-400 text-[#112a1f] rounded-xl p-4 mb-6 text-center shadow-lg">
          <p className="font-bold text-base">🎉 একাউন্ট থাকলে প্রতি অর্ডারে বিশেষ ছাড়!</p>
          <p className="text-sm mt-1 font-medium">লগইন করুন এবং প্রতিটি অর্ডারে
            <span className="font-extrabold underline mx-1">১০% – ২০% ডিসকাউন্ট</span>উপভোগ করুন!
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="Logo"
              className="w-16 h-16 rounded-xl mx-auto mb-4 border-2 border-gold shadow-lg object-cover"
              onError={e => { e.target.style.display = 'none'; }} />
            <h1 className="text-2xl font-bold text-white">লগইন করুন</h1>
            <p className="text-gray-400 text-sm mt-1">আপনার একাউন্টে প্রবেশ করুন</p>
          </div>

          {/* Info for order-based accounts */}
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg px-4 py-3 mb-5 text-sm text-blue-200">
            💡 <strong>টিপস:</strong> যদি আগে অর্ডার দিয়ে থাকেন তাহলে আপনার ফোন নম্বর দিয়ে Sign Up করে পাসওয়ার্ড সেট করুন, তারপর এখানে লগইন করুন।
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">ফোন নম্বর</label>
              <input type="tel" placeholder="০১XXXXXXXXX"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">পাসওয়ার্ড</label>
              <input type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-400 text-[#112a1f] font-bold py-3.5 rounded-lg hover:from-yellow-300 hover:to-gold transition-all shadow-[0_4px_15px_rgba(235,180,85,0.4)] disabled:opacity-60 text-base">
              {loading ? 'লগইন হচ্ছে...' : '🔑 লগইন করুন'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              একাউন্ট নেই?{' '}
              <Link to="/signup" className="text-gold font-bold hover:underline">এখনই নিবন্ধন করুন →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
