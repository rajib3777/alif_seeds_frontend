import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [restockAmount, setRestockAmount] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('products/');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (productId) => {
    const amount = parseInt(restockAmount[productId] || 0);
    if (isNaN(amount) || amount <= 0) return;

    setUpdatingId(productId);
    try {
      const res = await api.post(`products/${productId}/restock/`, { quantity: amount });
      if (res.data.success) {
        // Update local state
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, stock_quantity: res.data.new_stock, in_stock: true } : p
        ));
        setRestockAmount(prev => ({ ...prev, [productId]: '' }));
      }
    } catch (err) {
      alert('রিস্টক করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleManualStatus = async (productId, currentStatus) => {
    setUpdatingId(productId);
    try {
      await api.patch(`products/${productId}/`, { in_stock: !currentStatus });
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, in_stock: !currentStatus } : p
      ));
    } catch (err) {
      alert('স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">ইনভেন্টরি ম্যানেজার</h1>
            <p className="text-gray-500">পণ্যের স্টক লেভেল পর্যবেক্ষণ ও রিস্টক করুন</p>
          </div>
          <button 
            onClick={fetchProducts}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition"
          >
            🔄 রিফ্রেশ লিস্ট
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin text-4xl mb-4">🌀</div>
            <p className="text-gray-400">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-tighter">পণ্য</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-tighter">ক্যাটাগরি</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-tighter">বর্তমান স্টক</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-tighter">অবস্থা</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-tighter w-64">রিস্টক করুন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 rounded-md object-cover border border-gray-100" />
                          <span className="font-bold text-gray-800 text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase">{p.category_name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-extrabold ${p.stock_quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                            {p.stock_quantity}
                          </span>
                          <span className="text-xs text-gray-400 lowercase">ইউনিট</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleManualStatus(p.id, p.in_stock)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            min="1"
                            placeholder="Qty"
                            value={restockAmount[p.id] || ''}
                            onChange={(e) => setRestockAmount(prev => ({ ...prev, [p.id]: e.target.value }))}
                            className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <button 
                            disabled={updatingId === p.id}
                            onClick={() => handleRestock(p.id)}
                            className="bg-darkGreen text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-green-900 shadow-sm disabled:opacity-50"
                          >
                            {updatingId === p.id ? '...' : 'রিস্টক'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
