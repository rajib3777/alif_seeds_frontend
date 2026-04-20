import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Clock } from 'lucide-react';

const MOCK_ORDERS = [
  { id: 1, customer_name: 'আরিফ হোসেন', items: [{quantity: '১', product_name: 'ভুট্টার বীজ'}, {quantity: '২', product_name: 'পেঁপে বীজ'}], total_price: '৫৫০', time: '২ মিনিট আগে' },
  { id: 2, customer_name: 'জামাল হাসান', items: [{quantity: '৫', product_name: 'বোরো ধানের বীজ'}], total_price: '১,২০০', time: '৫ মিনিট আগে' },
  { id: 3, customer_name: 'শরীফ উদ্দিন', items: [{quantity: '১', product_name: 'রেড জোয়ার বীজ'}], total_price: '৩৫০', time: '১০ মিনিট আগে' },
  { id: 4, customer_name: 'রহিম মোল্লা', items: [{quantity: '২', product_name: 'গম বীজ'}], total_price: '৯৯০', time: '১৫ মিনিট আগে' },
  { id: 5, customer_name: 'সুমন দাস', items: [{quantity: '৩', product_name: 'টমেটো'}, {quantity: '১', product_name: 'লাউ বীজ'}], total_price: '১,৪৫০', time: '৩০ মিনিট আগে' },
  { id: 6, customer_name: 'করিম শেখ', items: [{quantity: '১০', product_name: 'সবজি বীজ কম্বো'}], total_price: '২,১০০', time: '১ ঘণ্টা আগে' },
  { id: 7, customer_name: 'ফরিদ আলম', items: [{quantity: '২', product_name: 'বেগুন বীজ'}], total_price: '৭৮০', time: '২ ঘণ্টা আগে' },
  { id: 8, customer_name: 'মনসুর হক', items: [{quantity: '৪', product_name: 'করলা বীজ'}], total_price: '৬৬০', time: '৩ ঘণ্টা আগে' },
];

const OrderCard = ({ order, index }) => {
  const itemsText = order.items.map(item => {
    const qty = String(item.quantity);
    const suffix = /^[0-9১২৩৪৫৬৭৮৯০]+$/.test(qty.trim()) ? 'টি' : 'x';
    return `${qty}${suffix} ${item.product_name}`;
  }).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-[#1a3a2a]/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-gold/50 transition-all group shadow-xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold border border-gold/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white group-hover:text-gold transition-colors">{order.customer_name}</h4>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              {order.time}
            </div>
          </div>
        </div>
        <div className="bg-gold text-darkGreen px-3 py-1 rounded-full text-[12px] font-black shadow-lg">
          ৳ {order.total_price}
        </div>
      </div>

      <div className="flex items-start gap-2 text-textSoft">
        <ShoppingBag className="w-4 h-4 mt-1 shrink-0 text-gold/60" />
        <p className="text-sm font-light leading-relaxed">
          {itemsText} <span className="text-gold/80 font-medium">কিনেছেন!</span>
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      </div>
    </motion.div>
  );
};

export default function RecentOrders() {
  const [orders] = useState(MOCK_ORDERS);

  if (orders.length === 0) return null;

  return (
    <section className="py-24 bg-darkGreen relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 bg-gold/10 px-4 py-1.5 rounded-full border border-gold/20 mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em]">Live Activity</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">সাম্প্রতিক <span className="text-gold">অর্ডারসমূহ</span></h2>
          <div className="w-20 h-1.5 bg-gold rounded-full shadow-[0_0_15px_rgba(235,180,85,0.4)]"></div>
          <p className="text-textSoft mt-6 max-w-lg font-light">সারা দেশের কৃষকরা আমাদের বীজের ওপর আস্থা রাখছেন। এক নজরে দেখে নিন আমাদের সাম্প্রতিক ডেলিভারিগুলো।</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
