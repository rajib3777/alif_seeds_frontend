import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import api from '../api';

export default function Checkout() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [deliveryZone, setDeliveryZone] = useState('Outside Dhaka');
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const totalWeight = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  let baseCharge = 120;
  if (deliveryZone === 'Dhaka City') baseCharge = 70;
  if (deliveryZone === 'Dhaka Suburb') baseCharge = 100;
  
  const extraWeight = Math.max(0, totalWeight - 0.5);
  const extraCharge = Math.ceil(extraWeight) * 10;
  
  const deliveryCharge = totalWeight >= 5 ? 0 : (baseCharge + extraCharge);
  const grandTotal = subtotal + deliveryCharge;

  useEffect(() => {
    const addressLC = form.address.toLowerCase();
    const cityKeywords = ['dhaka', 'mirpur', 'uttara', 'gulshan', 'banani', 'dhanmondi', 'mohammadpur', 'jatrabari', 'badda', 'rampura', 'tejgaon', 'basabo', 'adabor', 'bangshal', 'cantonment', 'chakbazar', 'dakshinkhan', 'darus salam', 'demra', 'gendaria', 'hazaribagh', 'kadamtali', 'kafrul', 'kalabagan', 'kamrangirchar', 'khilgaon', 'khilkhet', 'kotwali', 'lalbagh', 'motijheel', 'mugda', 'new market', 'pallabi', 'paltan', 'ramna', 'sabujbagh', 'rupnagar', 'shah ali', 'shahbagh', 'sher-e-bangla nagar', 'shyampur', 'sutrapur', 'turag', 'uttar khan', 'bhashantek', 'vatara', 'wari', 'mohakhali', 'bashundhara', 'dacca', 'daka', 'ঢাকা', 'মিরপুর', 'উত্তরা', 'গুলশান', 'বনানী', 'বনানি', 'ধানমন্ডি', 'মোহাম্মদপুর', 'যাত্রাবাড়ী', 'যাত্রাবাড়ি', 'বাড্ডা', 'রামপুরা', 'তেজগাঁও', 'বাসাবো', 'বাশাবো', 'বসুন্ধরা', 'খিলক্ষেত', 'মহাখালী'];
    const suburbKeywords = ['savar', 'keraniganj', 'dhamrai', 'nawabganj', 'dohar', 'ashulia', 'shavar', 'sabar', 'সাভার', 'keranigonj', 'keranigong', 'কেরানীগঞ্জ', 'কেরানিগন্জ', 'ধামরাই', 'nobabgonj', 'nawabgonj', 'নবাবগঞ্জ', 'নবাবগন্জ', 'দোহার', 'asulia', 'আশুলিয়া'];
    const outsideException = ['narayanganj', 'gazipur', 'tongi', 'narayangong', 'narayangonj', 'নারায়ণগঞ্জ', 'নারায়নগন্জ', 'gajipur', 'গাজীপুর', 'গাজিপুর', 'টঙ্গী', 'টংগি'];

    let matchedZone = 'Outside Dhaka';

    if (outsideException.some(k => addressLC.includes(k))) {
       matchedZone = 'Outside Dhaka';
    } else if (suburbKeywords.some(k => addressLC.includes(k))) {
       matchedZone = 'Dhaka Suburb';
    } else if (cityKeywords.some(k => addressLC.includes(k))) {
       matchedZone = 'Dhaka City';
    }
    
    setDeliveryZone(matchedZone);
  }, [form.address]);

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
        delivery_zone: deliveryZone,
        items: cart.map(item => ({ product: item.product.id, quantity: item.quantity }))
      };

      const res = await api.post('orders/', payload);

      setInvoiceData({
         orderId: res.data.id || Math.floor(Math.random() * 10000),
         name: form.name,
         phone: form.phone,
         address: form.address,
         cart: [...cart],
         subtotal,
         deliveryCharge,
         grandTotal
      });

      setSuccess(true);
    } catch (err) {
      alert('দুঃখিত, অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success && invoiceData) {
      const invoiceElement = document.getElementById('invoice-template');
      if (invoiceElement) {
        const opt = {
          margin:       0.5,
          filename:     `Invoice-Alif-Seeds-${invoiceData.orderId}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        setTimeout(() => {
          html2pdf().set(opt).from(invoiceElement).save().then(() => {
             clearCart();
          });
        }, 500);
      }
    }
  }, [success, invoiceData]); // eslint-disable-line

  if (cart.length === 0 && !success) {
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
                <label className="block text-gray-300 font-bold mb-2">পূর্ণাঙ্গ ডেলিভারি ঠিকানা *</label>
                <textarea
                  rows="4"
                  value={form.address}
                  onChange={e => setForm({...form, address: e.target.value})}
                  className={`w-full px-4 py-3 bg-midGreen border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold transition resize-none ${errors.address ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="বাড়ি/ফ্ল্যাট, রাস্তা, এলাকা, থানা, জেলা..."
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-2 flex justify-between">
                   <span>ডেলিভারি এরিয়া (Delivery Zone)</span>
                   <span className="text-xs text-gold font-normal px-2 py-0.5 bg-gold/10 rounded-full">স্বয়ংক্রিয়ভাবে সিলেক্টেড</span>
                </label>
                <select 
                   value={deliveryZone}
                   onChange={e => setDeliveryZone(e.target.value)}
                   className="w-full px-4 py-3 bg-midGreen border border-gray-600 rounded-xl text-white outline-none focus:border-gold transition appearance-none"
                >
                   <option value="Dhaka City">ঢাকার ভেতরে (Dhaka City) - বেস চার্জ ৭০৳</option>
                   <option value="Dhaka Suburb">ঢাকার উপশহর (Savar, Keraniganj etc.) - বেস চার্জ ১০০৳</option>
                   <option value="Outside Dhaka">ঢাকার বাইরে (Other Districts) - বেস চার্জ ১২০৳</option>
                </select>
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
                <div className="mb-4 bg-green-900/30 border border-green-500/20 p-3 rounded-lg text-sm text-gray-300">
                  {totalWeight >= 5 ? (
                    <div className="flex items-center gap-2 text-green-400 font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      অভিনন্দন! ৫ কেজি বা তার বেশি অর্ডারে আপনার ডেলিভারি একদম ফ্রি।
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-gold">{deliveryZone}</span> এর জন্য ডেলিভারি চার্জ হিসাব করা হচ্ছে (প্রথম ০.৫ কেজি বেস চার্জ, এরপর প্রতি কেজিতে +১০৳)
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center text-gray-400 mb-2">
                  <span>সাবটোটাল ({totalWeight} কেজি)</span>
                  <span className="text-white">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-gray-400 mb-4">
                  <span>ডেলিভারি চার্জ</span>
                  <span className={`${totalWeight >= 5 ? 'text-green-400 font-bold' : 'text-white'}`}>
                    {totalWeight >= 5 ? 'ফ্রি (FREE)' : `৳${deliveryCharge.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4">
                  <span className="text-xl font-bold text-white">সর্বমোট</span>
                  <span className="text-3xl font-bold text-gold">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <Link to="/cart" className="block mt-4 text-center text-gray-400 hover:text-gold transition text-sm">
              ← কার্টে ফিরে যান
            </Link>
          </motion.div>
        </div>
      </div>

      {/* SUCCESS MODAL (GLASSMORPHISM) */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-[0_0_40px_rgba(34,197,94,0.3)] max-w-lg w-full text-center relative overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-24 h-24 bg-green-500/20 border-4 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </motion.div>
              
              <h2 className="text-3xl font-bold text-white mb-2">অর্ডার সম্পন্ন হয়েছে! 🎉</h2>
              <p className="text-green-300 mb-4 font-bold bg-green-900/60 py-1.5 px-4 rounded-full text-sm inline-block border border-green-500/50 shadow-lg">
                 ↓ আপনার ইনভয়েসটি অটোমেটিক ডাউনলোড হচ্ছে
              </p>
              
              <p className="text-gray-200 mb-6 text-base leading-relaxed">
                আপনাকে অসংখ্য ধন্যবাদ! আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করে অর্ডারটি কনফার্ম করবেন।
              </p>
              
              <div className="bg-black/20 rounded-xl p-5 mb-6 text-left border border-white/10 backdrop-blur-lg">
                <p className="text-gold font-bold mb-2 border-b border-white/10 pb-2">অর্ডারের তথ্য:</p>
                <p className="text-gray-300 text-sm mt-2"><span className="text-white font-semibold">নাম:</span> {form.name}</p>
                <p className="text-gray-300 text-sm mt-1"><span className="text-white font-semibold">ফোন:</span> {form.phone}</p>
                <p className="text-gray-300 text-sm mt-1"><span className="text-white font-semibold">অর্ডার আইডি:</span> <span className="text-gold">#ALIF-{invoiceData?.orderId}</span></p>
              </div>
              
              <button
                onClick={() => { setSuccess(false); navigate('/'); clearCart(); }}
                className="w-full bg-gold text-darkGreen py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition shadow-[0_4px_20px_rgba(235,180,85,0.4)] hover:scale-105"
              >
                হোমপেজে ফিরে যান
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INVOICE TEMPLATE (HIDDEN, BUT RENDERED FOR HTML2PDF) */}
      {invoiceData && (
        <div style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px' }}>
          <div id="invoice-template" className="bg-white text-black p-10 font-sans">
             <div className="flex justify-between items-center border-b-4 border-green-700 pb-6 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-green-800 uppercase tracking-widest">Alif Seeds</h1>
                  <p className="text-gray-600 mt-1">Quality Agriculture & Farming Solutions</p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-wider">INVOICE</h2>
                  <p className="text-md font-bold text-gray-600 mt-1">#ALIF-{invoiceData.orderId}</p>
                  <p className="text-sm text-gray-500 mt-1">Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
             </div>

             <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 uppercase tracking-wider text-sm">Customer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs uppercase mb-1">Name</p>
                    <p className="font-semibold text-gray-800">{invoiceData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs uppercase mb-1">Phone</p>
                    <p className="font-semibold text-gray-800">{invoiceData.phone}</p>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-gray-600 text-xs uppercase mb-1">Delivery Address</p>
                    <p className="font-semibold text-gray-800">{invoiceData.address}</p>
                  </div>
                </div>
             </div>

             <table className="w-full text-left mb-8 border-collapse">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="py-4 px-4 uppercase font-bold text-xs tracking-wider rounded-tl-lg">Product Description</th>
                    <th className="py-4 px-4 uppercase font-bold text-xs tracking-wider text-center">Qty (KG)</th>
                    <th className="py-4 px-4 uppercase font-bold text-xs tracking-wider text-right rounded-tr-lg">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.cart.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                       <td className="py-4 px-4 text-gray-800 font-medium">{item.product.name}</td>
                       <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                       <td className="py-4 px-4 text-right text-gray-700 font-medium">BDT {(parseFloat(item.product.price) * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
             </table>

             <div className="flex justify-end">
                <div className="w-1/2">
                   <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Subtotal:</span>
                      <span className="text-gray-800 font-medium">BDT {invoiceData.subtotal.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">Delivery Charge:</span>
                      <span className="text-gray-800 font-medium">{invoiceData.deliveryCharge === 0 || invoiceData.cart.reduce((s,i)=>s+i.quantity,0) >= 5 ? 'FREE' : `BDT ${invoiceData.deliveryCharge.toLocaleString()}`}</span>
                   </div>
                   <div className="flex justify-between py-4 mt-2 bg-green-50 px-4 rounded-lg">
                      <span className="text-xl font-bold text-green-800 uppercase">Grand Total:</span>
                      <span className="text-xl font-bold text-green-800">BDT {invoiceData.grandTotal.toLocaleString()}</span>
                   </div>
                </div>
             </div>

             <div className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
                <p className="font-semibold text-gray-600 mb-1">Thank you for shopping with Alif Seeds!</p>
                <p>Cash on Delivery • Quality Guaranteed</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
