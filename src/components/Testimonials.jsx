import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const reviews = [
  {
    id: 1,
    name: "রাকিব হাসান",
    role: "ডেইরি ফার্মার, মানিকগঞ্জ",
    rating: 5,
    quote: "তাদের সর্গাম সুদান ঘাস দিয়ে আমার ডেইরি খামারের উৎপাদন প্রায় দ্বিগুণ হয়েছে। বীজের মান অত্যন্ত ভালো এবং ডেলিভারি খুব দ্রুত পেয়েছি। আলিফ এগ্রো সার্ভিস সত্যিই বিশ্বস্ত।",
    img: "/farmer1.png"
  },
  {
    id: 2,
    name: "আব্দুল মজিদ",
    role: "প্রান্তিক কৃষক, ময়মনসিংহ",
    rating: 5,
    quote: "আলিফ সীডস-এর উফশী বোরো ধান লাগিয়ে গত বছরের চেয়ে প্রায় ২ গুণ বেশি ফলন পেয়েছি। বীজের অঙ্কুরোদগম শক্তি অসাধারণ। এখন প্রতি মৌসুমে এখান থেকেই বীজ নিই।",
    img: "/farmer1.png"
  },
  {
    id: 3,
    name: "মো. জলিল মিয়া",
    role: "বাণিজ্যিক খামারি, গাজীপুর",
    rating: 5,
    quote: "৩ বছর ধরে আলিফ সীডস থেকে হাইব্রিড সবজির বীজ নিচ্ছি। তাদের বীজের মান বাজারে সবার সেরা। দাম সাশ্রয়ী এবং সার্ভিস অনেক ভালো। সকলকে নির্দ্বিধায় রিকমেন্ড করি।",
    img: "/farmer1.png"
  }
];

const StarIcon = () => (
  <svg className="w-5 h-5 text-gold fill-gold" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-midGreen text-white">
      <div className="container mx-auto px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-3 font-semibold">আমাদের ক্লায়েন্ট রিভিউ</p>
          <h2 className="text-3xl font-bold uppercase tracking-wider">খামারিরা কী বলছেন</h2>
        </motion.div>

        {/* Review Cards - Show all 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`bg-darkGreen/60 rounded-2xl p-8 border flex flex-col gap-4 transition-all duration-300 ${i === current ? 'border-gold shadow-[0_0_30px_rgba(235,180,85,0.15)] scale-105' : 'border-white/5'}`}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(review.rating)].map((_, s) => <StarIcon key={s} />)}
              </div>

              {/* Quote */}
              <p className="text-gray-300 text-sm leading-relaxed flex-1 italic">
                "{review.quote}"
              </p>

              {/* Person */}
              <div className="flex items-center gap-4 border-t border-white/10 pt-4 mt-2">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold shadow-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = '/cat2.jpg'; }}
                />
                <div>
                  <h4 className="font-bold text-white text-base">{review.name}</h4>
                  <p className="text-gold text-xs uppercase tracking-widest mt-0.5">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${current === i ? 'w-8 h-3 bg-gold' : 'w-3 h-3 bg-gray-600 hover:bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
