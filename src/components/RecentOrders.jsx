import { useState } from 'react';

const MOCK_ORDERS = [
  { id: 1, customer_name: 'আরিফ হোসেন', items: [{quantity: '১', product_name: 'ভুট্টার বীজ'}, {quantity: '২', product_name: 'পেঁপে বীজ'}], total_price: '৫৫০' },
  { id: 2, customer_name: 'জামাল হাসান', items: [{quantity: '৫', product_name: 'বোরো ধানের বীজ'}], total_price: '১,২০০' },
  { id: 3, customer_name: 'শরীফ উদ্দিন', items: [{quantity: '১', product_name: 'রেড জোয়ার বীজ'}], total_price: '৩৫০' },
  { id: 4, customer_name: 'রহিম মোল্লা', items: [{quantity: '২', product_name: 'গম বীজ'}], total_price: '৯৯০' },
  { id: 5, customer_name: 'সুমন দাস', items: [{quantity: '৩', product_name: 'হাইব্রিড টমেটো'}, {quantity: '১', product_name: 'লাউ বীজ'}], total_price: '১,৪৫০' },
  { id: 6, customer_name: 'করিম শেখ', items: [{quantity: '১০', product_name: 'সবজি বীজ কম্বো'}], total_price: '২,১০০' },
  { id: 7, customer_name: 'ফরিদ আলম', items: [{quantity: '২', product_name: 'হাইব্রিড বেগুন বীজ'}], total_price: '৭৮০' },
  { id: 8, customer_name: 'মনসুর হক', items: [{quantity: '৪', product_name: 'করলা বীজ'}, {quantity: '১', product_name: 'শসার বীজ'}], total_price: '৬৬০' },
  { id: 9, customer_name: 'নাজমুল ইসলাম', items: [{quantity: '১', product_name: 'সূর্যমুখী বীজ'}], total_price: '৪৩০' },
  { id: 10, customer_name: 'সালমা বেগম', items: [{quantity: '৬', product_name: 'ফুলকপি বীজ'}], total_price: '৮৪০' },
];

export default function RecentOrders() {
  const [orders] = useState(MOCK_ORDERS);

  if (orders.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-[#0d2117] via-[#1a422f] to-[#0d2117] border-y-2 border-gold/40 py-5 overflow-hidden relative shadow-lg z-10">
      <div className="container mx-auto px-4 mb-3">
        <p className="text-gold text-xs font-bold uppercase tracking-widest flex items-center gap-2 drop-shadow-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold shadow-[0_0_8px_rgba(235,180,85,0.8)]"></span>
          </span>
          সাম্প্রতিক অর্ডারসমূহ
        </p>
      </div>
      
      <div className="flex whitespace-nowrap animate-marquee mt-1">
        {[...orders, ...orders, ...orders].map((order, i) => {
          // Add 'টি' after number if it's purely digits in english or bengali
          const itemsText = order.items.map(item => {
             const qty = String(item.quantity);
             const suffix = /^[0-9১২৩৪৫৬৭৮৯০]+$/.test(qty.trim()) ? 'টি' : 'x';
             return `${qty}${suffix} ${item.product_name}`;
          }).join(', ');
          
          return (
            <div key={`${order.id}-${i}`} className="inline-block mx-4 bg-black/40 backdrop-blur-md border border-gold/40 rounded-full px-6 py-2.5 text-white text-[13px] shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-all hover:bg-gold/15 hover:border-gold cursor-default group">
               👤 <span className="font-bold text-gold group-hover:text-yellow-300 transition-colors">{order.customer_name}</span> এইমাত্র <span className="font-medium text-green-100">{itemsText}</span> কিনেছেন! 
               <span className="ml-3 font-bold text-[#112a1f] bg-gradient-to-r from-gold to-yellow-400 px-3 py-1 rounded-full shadow-sm">৳ {order.total_price}</span>
            </div>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}
