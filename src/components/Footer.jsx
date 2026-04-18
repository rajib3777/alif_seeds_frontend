const Facebook = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const Twitter = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>);
const Instagram = () => (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);

import { useState } from 'react';
import api from '../api';

export default function Footer() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) {
      setStatus({ type: 'error', message: 'সবগুলো ঘর পূরণ করুন' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await api.post('messages/', form);
      setStatus({ type: 'success', message: 'আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!' });
      setForm({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact error:', error);
      setStatus({ type: 'error', message: 'বার্তা পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#1B291C] text-white pt-24 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1 border-r border-gray-800 pr-8">
          <h3 className="text-2xl font-bold tracking-widest mb-6 uppercase text-gold">আলিফ সীডস.</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            আমরা দিচ্ছি সেরা মানের কৃষি বীজ এবং পরামর্শ। আপনার খামারের উৎপাদন বৃদ্ধি আমাদের প্রধান লক্ষ্য।
          </p>
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-darkGreen cursor-pointer transition"><Facebook size={16}/></div>
             <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-darkGreen cursor-pointer transition"><Twitter size={16}/></div>
             <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gold hover:text-darkGreen cursor-pointer transition"><Instagram size={16}/></div>
          </div>
        </div>
        
        <div>
           <h4 className="font-bold text-lg mb-6 tracking-widest">Contact Us</h4>
           <div className="text-gray-400 text-sm space-y-4 flex flex-col">
             <span><strong className="text-white">Hotline:</strong> +880 12 34 5678</span>
             <span><strong className="text-white">Email:</strong> info@alifseeds.com</span>
             <span><strong className="text-white">Address:</strong> ঢাকা, বাংলাদেশ</span>
           </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="bg-[#233524] p-8 rounded-xl shadow-2xl border border-gray-700/30">
             <p className="text-gold uppercase tracking-widest text-xs font-bold mb-2">Contact Now</p>
             <h4 className="font-bold text-2xl mb-6 uppercase">GET IN TOUCH NOW</h4>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                    className="bg-[#1A261A] border border-gray-800 px-4 py-3 rounded text-sm w-full outline-none focus:ring-1 focus:ring-gold text-white" 
                  />
                  <input 
                    type="text" 
                    placeholder="Phone Number" 
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    className="bg-[#1A261A] border border-gray-800 px-4 py-3 rounded text-sm w-full outline-none focus:ring-1 focus:ring-gold text-white" 
                  />
                </div>
                <textarea 
                  placeholder="Your Message" 
                  rows="3" 
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="bg-[#1A261A] border border-gray-800 px-4 py-3 rounded text-sm w-full outline-none focus:ring-1 focus:ring-gold text-white"
                ></textarea>
                
                {status && (
                  <div className={`text-sm font-bold ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {status.message}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`bg-gold text-darkGreen font-bold px-8 py-3 rounded transition w-full sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
             </form>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-8 mb-12">
        <div className="bg-gradient-to-r from-gold to-[#f0c978] text-darkGreen rounded-xl px-12 py-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <h2 className="text-3xl font-bold font-serif italic relative z-10 mb-4 md:mb-0">We are Leader in Agriculture Market</h2>
          <button className="border-2 border-darkGreen px-8 py-3 rounded font-bold hover:bg-darkGreen hover:text-gold transition shadow-md relative z-10">READ MORE</button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-8">
        © {new Date().getFullYear()} Alif Seeds. All Rights Reserved.
      </div>
    </footer>
  );
}
