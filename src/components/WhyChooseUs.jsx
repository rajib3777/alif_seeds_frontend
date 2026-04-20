import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Banknote, Truck, Star, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    icon: <ShieldCheck className="w-10 h-10" />,
    title: "নির্ভরযোগ্য মান",
    desc: "আমরা সরাসরি আধুনিক ল্যাবরেটরিতে পরীক্ষিত এবং উচ্চ অঙ্কুরোদগম ক্ষমতার নিশ্চয়তা সম্পন্ন প্রিমিয়াম কোয়ালিটি বীজ সরবরাহ করি।"
  },
  {
    icon: <UserCheck className="w-10 h-10" />,
    title: "বিশেষজ্ঞ পরামর্শ",
    desc: "আমাদের অভিজ্ঞ কৃষিবিদরা আপনাদের চাষাবাদে বীজ বপন থেকে শুরু করে ফসল ঘরে তোলা পর্যন্ত সকল প্রকার বৈজ্ঞানিক পরামর্শ প্রদান করেন।"
  },
  {
    icon: <Banknote className="w-10 h-10" />,
    title: "সরাসরি ও সাশ্রয়ী মূল্য",
    desc: "কোনো মধ্যসত্ত্বভোগী ছাড়াই সরাসরি পণ্য সরবরাহ করার কারণে আমরা আপনাকে দিতে পারি বাজারের সেরা এবং সবচেয়ে সাশ্রয়ী মূল্য।"
  },
  {
    icon: <Truck className="w-10 h-10" />,
    title: "সারা দেশে দ্রুত ডেলিভারি",
    desc: "আমাদের নিজস্ব লজিস্টিক ও জনপ্রিয় কুরিয়ার সার্ভিসের মাধ্যমে সারা বাংলাদেশের যেকোনো উপজেলা বা গ্রামে দ্রুততম সময়ে পণ্য পৌঁছে দেই।"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-darkGreen relative overflow-hidden">
      {/* Visual background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-gold rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-gold rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-gold mb-4"
          >
            <Star className="w-5 h-5 fill-gold" />
            <span className="text-sm font-bold uppercase tracking-[0.3em]">Our Commitment</span>
            <Star className="w-5 h-5 fill-gold" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          >
            কেন <span className="text-gold italic">Alif Seeds</span> আপনার প্রথম পছন্দ?
          </motion.h2>
          <div className="w-24 h-1.5 bg-gold mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl group hover:bg-gold/10 hover:border-gold/30 transition-all duration-500 flex flex-col items-center text-center shadow-xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-gold/20 text-gold flex items-center justify-center mb-6 shadow-inner group-hover:bg-gold group-hover:text-darkGreen transition-all duration-500 transform group-hover:rotate-[10deg]">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light group-hover:text-white/90 transition-colors">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic CTA at the bottom of the section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center"
        >
          <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/10 shadow-2xl">
            <HeartHandshake className="text-gold w-6 h-6" />
            <p className="text-white font-bold text-sm sm:text-base">
              আপনাদের সাফল্যই আমাদের মূল লক্ষ্য। আমাদের সাথে থাকুন, আধুনিক কৃষির গর্ব হোন।
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
