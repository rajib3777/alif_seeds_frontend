import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!form.name || !form.phone || !form.password) { setError('সব তথ্য দিন'); return; }
    if (form.password !== form.confirm) { setError('পাসওয়ার্ড মিলছে না'); return; }
    if (form.password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'); return; }
    setLoading(true);
    try {
      const res = await api.post('auth/register/', {
        phone: form.phone,
        name: form.name,
        password: form.password,
      });
      // Auto-login after registration
      login({ name: form.name, phone: form.phone });
      navigate('/account');
    } catch (err) {
      const msg = err?.response?.data?.error;
      setError(msg || 'নিবন্ধন করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-darkGreen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(42,111,46,0.15) 0%, transparent 50%)' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Benefit Banner */}
        <div className="bg-gradient-to-r from-[#1a4a2e] to-[#0f2e1e] border border-gold/40 rounded-xl p-4 mb-6 shadow-lg">
          <p className="text-gold font-bold text-sm text-center mb-2">✨ একাউন্ট খুললে যা পাবেন:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div className="flex items-center gap-1.5"><span className="text-gold">✅</span> প্রতি অর্ডারে ১০% ছাড়</div>
            <div className="flex items-center gap-1.5"><span className="text-gold">✅</span> বিশেষ সদস্য অফার</div>
            <div className="flex items-center gap-1.5"><span className="text-gold">✅</span> অর্ডার ট্র্যাকিং</div>
            <div className="flex items-center gap-1.5"><span className="text-gold">✅</span> অর্ডার হিস্ট্রি</div>
          </div>
        </div>

        {/* Previous order info */}
        <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg px-4 py-3 mb-5 text-sm text-amber-200">
          📦 <strong>আগে অর্ডার করেছেন?</strong> আপনার ফোন নম্বর দিয়ে নিচে নিবন্ধন করুন — আপনার পুরো অর্ডার হিস্ট্রি দেখতে পাবেন!
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-7">
            <img src="/logo.jpg" alt="Logo"
              className="w-16 h-16 rounded-xl mx-auto mb-4 border-2 border-gold shadow-lg object-cover"
              onError={e => { e.target.style.display = 'none'; }} />
            <h1 className="text-2xl font-bold text-white">নিবন্ধন করুন</h1>
            <p className="text-gray-400 text-sm mt-1">বিনামূল্যে একাউন্ট তৈরি করুন</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/20 border border-green-500/30 text-green-300 text-sm rounded-lg px-4 py-3 mb-4">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">পুরো নাম</label>
              <input type="text" placeholder="আপনার নাম লিখুন"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">ফোন নম্বর</label>
              <input type="tel" placeholder="০১XXXXXXXXX"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">পাসওয়ার্ড</label>
              <input type="password" placeholder="কমপক্ষে ৬ অক্ষর"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold mb-1.5 block">পাসওয়ার্ড নিশ্চিত করুন</label>
              <input type="password" placeholder="পাসওয়ার্ড আবার লিখুন"
                value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-gold to-yellow-400 text-[#112a1f] font-bold py-3.5 rounded-lg hover:from-yellow-300 hover:to-gold transition-all shadow-[0_4px_15px_rgba(235,180,85,0.4)] disabled:opacity-60 text-base mt-1">
              {loading ? 'একাউন্ট তৈরি হচ্ছে...' : '🌱 একাউন্ট তৈরি করুন'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              আগে থেকেই একাউন্ট আছে?{' '}
              <Link to="/login" className="text-gold font-bold hover:underline">লগইন করুন →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
