import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// =============================================
// COMPREHENSIVE KNOWLEDGE BASE (Bangla + English)
// =============================================
const knowledgeBase = [
  {
    id: 'greeting',
    keywords: ['হ্যালো', 'হাই', 'সালাম', 'নমস্কার', 'আস্সালামু', 'hello', 'hi', 'hey', 'salaam', 'assalamu', 'good morning', 'good evening', 'কেমন', 'আছেন', 'শুভ'],
    response: `আস্সালামু আলাইকুম! 👋 **আলিফ সিডস**-এ স্বাগতম!

আমি আপনাকে যেসব বিষয়ে সাহায্য করতে পারব:
🛒 অর্ডার করার পদ্ধতি
📦 পণ্যের স্টক ও দাম
🚚 ডেলিভারি তথ্য
💳 পেমেন্ট পদ্ধতি
📞 যোগাযোগ

নিচের বাটন চাপুন বা সরাসরি প্রশ্ন করুন! 😊`,
    buttons: []
  },
  {
    id: 'order',
    keywords: [
      'অর্ডার', 'order', 'কিনতে চাই', 'কিনব', 'কিভাবে', 'kivabe', 'কেনা', 'buy', 'purchase',
      'cart', 'কার্ট', 'checkout', 'চেকআউট', 'কিনতে', 'কিনতে পারব', 'order kori', 'order korbo',
      'কিভাবে অর্ডার', 'how to order', 'how to buy', 'order process', 'কেনার নিয়ম'
    ],
    response: `📦 **অর্ডার করার ধাপগুলো:**

**ধাপ ১:** পছন্দের পণ্যে ক্লিক করুন
**ধাপ ২:** "কার্টে যোগ করুন" চাপুন
**ধাপ ৩:** কার্টে গিয়ে পরিমাণ ঠিক করুন
**ধাপ ৪:** "চেকআউট করুন" চাপুন
**ধাপ ৫:** নাম, ফোন ও ঠিকানা দিন
**ধাপ ৬:** ডেলিভারি জোন বেছে "অর্ডার দিন" চাপুন ✅

এখনই পণ্য দেখতে নিচের বাটনে চাপুন! 👇`,
    buttons: [
      { label: '🛒 পণ্য দেখুন', action: 'navigate', path: '/' },
      { label: '🛍️ কার্ট দেখুন', action: 'navigate', path: '/cart' }
    ]
  },
  {
    id: 'delivery',
    keywords: [
      'ডেলিভারি', 'delivery', 'চার্জ', 'charge', 'শিপিং', 'shipping', 'কতদিন', 'কত দিন',
      'পৌঁছাবে', 'পৌছাবে', 'কত টাকা', 'free delivery', 'ফ্রি ডেলিভারি', 'ডেলিভারি চার্জ',
      'delivery charge', 'কত লাগবে', 'charge koto', 'কতো', 'courier', 'কুরিয়ার'
    ],
    response: `🚚 **ডেলিভারি চার্জ তথ্য:**

| জোন | চার্জ |
|-----|-------|
| 🏙️ ঢাকা সিটি | ৭০৳ |
| 🌆 ঢাকা সাবার্ব | ১০০৳ |
| 🗺️ ঢাকার বাইরে | ১২০৳ |

⚖️ অতিরিক্ত ওজন: প্রতি কেজিতে +১০৳

🎉 **বিশেষ অফার:** ৫ কেজি বা বেশি অর্ডারে **ডেলিভারি সম্পূর্ণ ফ্রি!**

⏱️ ডেলিভারি সময়: ২-৫ কার্যদিবস`,
    buttons: [
      { label: '🛒 এখনই অর্ডার করুন', action: 'navigate', path: '/' }
    ]
  },
  {
    id: 'payment',
    keywords: [
      'পেমেন্ট', 'payment', 'টাকা', 'pay', 'bkash', 'বিকাশ', 'নগদ', 'nagad', 'ক্যাশ', 'cash',
      'অনলাইন পেমেন্ট', 'online payment', 'কিভাবে দেব', 'how to pay', 'pay kori', 'payment method'
    ],
    response: `💳 **পেমেন্ট পদ্ধতি:**

✅ **ক্যাশ অন ডেলিভারি**
পণ্য হাতে পাওয়ার পরে ডেলিভারি ম্যানকে টাকা দিন।

এটাই সবচেয়ে নিরাপদ এবং সহজ পদ্ধতি! আপনাকে আগে থেকে কোনো টাকা দিতে হবে না। 😊

_বিকাশ/নগদ পেমেন্ট শীঘ্রই চালু হবে!_`,
    buttons: [
      { label: '📦 অর্ডার করুন', action: 'navigate', path: '/' }
    ]
  },
  {
    id: 'return',
    keywords: [
      'রিটার্ন', 'return', 'ফেরত', 'বাতিল', 'cancel', 'ক্যান্সেল', 'সমস্যা', 'নষ্ট',
      'damage', 'wrong', 'ভুল পণ্য', 'খারাপ', 'refund', 'রিফান্ড', 'exchange', 'এক্সচেঞ্জ'
    ],
    response: `🔄 **রিটার্ন ও বাতিল নীতি:**

✅ পণ্য নষ্ট বা ভুল এলে ফেরত দেওয়া যাবে
✅ পণ্য পাওয়ার **২৪ ঘণ্টার মধ্যে** জানাতে হবে
✅ ছবিসহ আমাদের ফোনে জানান
✅ সমস্যার পণ্য নতুন করে পাঠানো হবে

আমরা আপনার সন্তুষ্টি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ! 💚`,
    buttons: [
      { label: '📞 যোগাযোগ করুন', action: 'phone', value: 'tel:+8801234567890' }
    ]
  },
  {
    id: 'contact',
    keywords: [
      'ফোন', 'phone', 'যোগাযোগ', 'contact', 'নম্বর', 'number', 'কল', 'call',
      'হেল্প', 'help', 'সাহায্য', 'support', 'কথা বলব', 'talk', 'reach', 'email', 'ইমেইল'
    ],
    response: `📞 **যোগাযোগের তথ্য:**

📱 **ফোন:** +880 1234-567890
📧 **ইমেইল:** info@alifseeds.com
🕐 **সময়:** সকাল ৯টা - রাত ৯টা
📅 **দিন:** সপ্তাহের ৭ দিন

সরাসরি কল করতে বাটনে চাপুন! 👇`,
    buttons: [
      { label: '📞 এখনই কল করুন', action: 'phone', value: 'tel:+8801234567890' }
    ]
  },
  {
    id: 'about',
    keywords: [
      'আলিফ', 'alif', 'সম্পর্কে', 'about', 'company', 'কোম্পানি', 'কারা', 'who are you',
      'কি', 'what is', 'seeds', 'বীজ কোম্পানি', 'কোথায়', 'where', 'bangladesh', 'বাংলাদেশ'
    ],
    response: `🌱 **আলিফ সিডস সম্পর্কে:**

আলিফ সিডস বাংলাদেশের একটি **বিশ্বস্ত বীজ বাজার**। আমরা কৃষকদের জন্য উন্নতমানের বীজ সরবরাহ করি।

🌾 **আমাদের পণ্য সমূহ:**
• ধান বীজ • গম বীজ • ভুট্টা বীজ
• সবজি বীজ • ফলের বীজ • সরগাম বীজ

⭐ **কেন আলিফ সিডস?**
✅ মানের নিশ্চয়তা
✅ সেরা দাম
✅ দ্রুত ডেলিভারি
✅ বিশ্বস্ত সেবা`,
    buttons: [
      { label: '🌿 পণ্য দেখুন', action: 'navigate', path: '/' }
    ]
  },
  {
    id: 'price',
    keywords: [
      'দাম', 'price', 'মূল্য', 'cost', 'কত', 'কতো', 'rate', 'রেট', 'টাকা', 'taka',
      'সস্তা', 'cheap', 'discounts', 'ছাড়', 'offer', 'অফার', 'কমদামে', 'affordable'
    ],
    response: `💰 **দাম সম্পর্কে:**

আমাদের সব পণ্যের দাম সরাসরি পণ্য পেজে দেখতে পাবেন।

🎉 **বিশেষ ছাড়:**
• বেশি পরিমাণে কিনলে সাশ্রয়
• ৫ কেজি+ অর্ডারে **ডেলিভারি ফ্রি**

সব পণ্যের দাম দেখতে নিচে ক্লিক করুন! 👇`,
    buttons: [
      { label: '💸 পণ্যের দাম দেখুন', action: 'navigate', path: '/' }
    ]
  },
  {
    id: 'track',
    keywords: [
      'ট্র্যাক', 'track', 'অর্ডার কোথায়', 'কোথায় আছে', 'status', 'স্ট্যাটাস', 'update',
      'আপডেট', 'delivery status', 'কখন আসবে', 'when will', 'কত সময়'
    ],
    response: `📍 **অর্ডার ট্র্যাকিং:**

বর্তমানে অর্ডার দেওয়ার পর আমাদের টিম আপনার দেওয়া ফোনে **কনফার্মেশন কল** দেবে।

📞 ডেলিভারির আগে আপনাকে জানানো হবে।

📱 যেকোনো আপডেটের জন্য আমাদের সাথে যোগাযোগ করুন।`,
    buttons: [
      { label: '📞 কল করুন', action: 'phone', value: 'tel:+8801234567890' }
    ]
  }
];

const quickReplies = [
  { label: '🛒 অর্ডার করব', id: 'order' },
  { label: '🚚 ডেলিভারি চার্জ', id: 'delivery' },
  { label: '💳 পেমেন্ট', id: 'payment' },
  { label: '📦 স্টক চেক করুন', id: 'stock_prompt' },
  { label: '📞 যোগাযোগ', id: 'contact' },
];

function findResponse(text) {
  const lowerText = text.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    for (const kw of item.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        score += kw.length; // longer keyword matches score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  return bestScore > 0 ? bestMatch : null;
}

// =============================================
// SYNONYM MAP: English, transliteration, misspellings → Bangla search term
// =============================================
const synonymMap = [
  // Rice / Dhan
  { patterns: ['rice', 'rais', 'ries', 'dhan', 'dhaan', 'daan', 'daan bij', 'dn', 'dhan bij', 'chan'], bangla: 'ধান' },
  // Wheat / Gom
  { patterns: ['wheat', 'weat', 'wheet', 'gom', 'gom bij', 'goum', 'gam', 'gum bij'], bangla: 'গম' },
  // Corn / Maize / Bhutta
  { patterns: ['corn', 'maize', 'bhutta', 'bhuttta', 'bhutra', 'bhuta', 'vituta', 'corn seed', 'maize seed', 'ভুট্টা বীজ'], bangla: 'ভুট্টা' },
  // Sorghum / Sudan / Sarghum
  { patterns: ['sorgum', 'sorghum', 'sorghum', 'sorgham', 'sudan', 'sudan grass', 'sarghum', 'sergam', 'sorhum', 'sorgam'], bangla: 'সরগাম' },
  // Vegetable seeds
  { patterns: ['vegetable', 'vegitable', 'shobji', 'sobji', 'sobzi', 'shobji bij', 'veg', 'veges', 'sabzi'], bangla: 'সবজি' },
  // Tomato
  { patterns: ['tomato', 'tomate', 'tometo', 'tamato', 'tomato bij'], bangla: 'টমেটো' },
  // Mustard / Sarisha
  { patterns: ['mustard', 'sarisha', 'sarsa', 'sarso', 'sarisha bij', 'mustrad'], bangla: 'সরিষা' },
  // Lentil / Masur
  { patterns: ['lentil', 'masur', 'masor', 'masoor', 'dal', 'daal'], bangla: 'মসুর' },
  // Potato / Alu
  { patterns: ['potato', 'alu', 'aloo', 'poteto', 'poteto bij', 'alu bij'], bangla: 'আলু' },
  // Onion seeds
  { patterns: ['onion', 'piaz', 'peyaz', 'piyaz', 'onion seed'], bangla: 'পেঁয়াজ' },
  // Chili
  { patterns: ['chili', 'chilli', 'morich', 'mirchi', 'chili seed', 'red chili'], bangla: 'মরিচ' },
  // Garlic
  { patterns: ['garlic', 'rasun', 'rashun', 'rasoon'], bangla: 'রসুন' },
];

function normalizeSynonym(text) {
  const lower = text.toLowerCase().trim();
  for (const entry of synonymMap) {
    if (entry.patterns.some(p => lower.includes(p))) {
      return entry.bangla;
    }
  }
  return lower;
}

function fuzzyMatch(productName, query) {
  const pn = productName.toLowerCase();
  const q = query.toLowerCase();
  if (pn.includes(q) || q.includes(pn)) return true;
  // Character overlap scoring
  let matches = 0;
  for (const ch of q) {
    if (pn.includes(ch)) matches++;
  }
  return matches / Math.max(q.length, 1) > 0.6;
}

function isStockQuery(text) {
  const lowerText = text.toLowerCase();
  const stockKeywords = [
    'স্টক', 'stock', 'আছে', 'পাওয়া যায়', 'পাব', 'available', 'কি পাব',
    'পাওয়া', 'পাচ্ছি না', 'পাচ্ছি', 'আছে কি', 'in stock', 'out of stock',
    'আছে কিনা', 'কিনতে পারব', 'বীজ আছে', 'seed available', 'bij ache', 'bij pabo'
  ];
  // Also treat as stock query if it matches any synonym (product name search)
  const matchesSynonym = synonymMap.some(e => e.patterns.some(p => lowerText.includes(p)));
  return stockKeywords.some(kw => lowerText.includes(kw)) || matchesSynonym;
}

function extractProductName(text) {
  const removeWords = [
    'স্টক', 'stock', 'আছে', 'আছে কি', 'আছে কিনা', 'পাওয়া যায়', 'পাব', 'available',
    'কি', 'কিনা', 'কিনতে পারব', 'বীজের', 'বীজ এর', 'er', 'এর', 'seed', 'koba', 'পাচ্ছি',
    'কোথায়', 'পাচ্ছি না', 'দেখাও', 'দেখান', 'in', 'of', 'out', 'is', 'that', 'bij', 'বীজ',
    'আমাকে', 'দেখতে', 'চাই', 'জানতে', 'চেক', 'check', 'find'
  ];
  let query = text.toLowerCase();
  for (const w of removeWords) {
    query = query.replace(new RegExp(`\\b${w}\\b`, 'gi'), '').trim();
  }
  return normalizeSynonym(query.trim() || text.trim());
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'bot',
      text: `আস্সালামু আলাইকুম! 👋 **আলিফ সিডস**-এ স্বাগতম!\n\nআমি আপনাকে অর্ডার, ডেলিভারি, স্টক সহ সব বিষয়ে সাহায্য করতে পারব। নিচের বাটনে চাপুন বা আপনার প্রশ্ন লিখুন!`,
      buttons: [],
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [stockPrompt, setStockPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setHasUnread(false);
  }, [isOpen]);

  const addBotMessage = (text, buttons = [], delay = 600) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now(), from: 'bot', text, buttons, time: new Date() }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text, buttons: [], time: new Date() }]);
  };

  const handleAction = (btn) => {
    if (btn.action === 'navigate') {
      setIsOpen(false);
      navigate(btn.path);
    } else if (btn.action === 'phone') {
      window.location.href = btn.value;
    } else if (btn.action === 'view_product') {
      setIsOpen(false);
      navigate(`/product/${btn.productId}`);
    }
  };

  const handleStockCheck = async (rawQuery) => {
    setStockPrompt(false);
    setIsTyping(true);
    // Normalize: translate English/misspelled to Bangla
    const query = normalizeSynonym(rawQuery);
    try {
      const res = await api.get('products/');
      const products = res.data;
      const matched = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.category_name && p.category_name.toLowerCase().includes(query.toLowerCase())) ||
        fuzzyMatch(p.name, query) ||
        fuzzyMatch(p.name, rawQuery)
      );

      setIsTyping(false);
      if (matched.length === 0) {
        addBotMessage(
          `দুঃখিত, **"${rawQuery}"** নামে কোনো পণ্য খুঁজে পাইনি।\n\nঅনুগ্রহ করে অন্য নামে সার্চ করুন অথবা আমাদের সম্পূর্ণ পণ্য তালিকা দেখুন।`,
          [{ label: '🌿 সব পণ্য দেখুন', action: 'navigate', path: '/' }],
          0
        );
      } else {
        const lines = matched.slice(0, 5).map(p =>
          `${p.in_stock ? '✅' : '❌'} **${p.name}** — ৳${p.price}/${p.unit || 'কেজি'} — ${p.in_stock ? 'স্টকে আছে' : 'স্টক শেষ'}`
        ).join('\n');

        const actionButtons = matched.slice(0, 3).map(p => (
          { label: `👁️ ${p.name.slice(0, 14)} দেখুন`, action: 'view_product', productId: p.id }
        ));
        if (matched.some(p => p.in_stock)) {
          actionButtons.push({ label: '🛒 অর্ডার করুন', action: 'navigate', path: `/product/${matched.find(p => p.in_stock)?.id}` });
        }

        addBotMessage(
          `🔍 **"${rawQuery}" এর ফলাফল (${matched.length}টি পণ্য):**\n\n${lines}`,
          actionButtons,
          0
        );
      }
    } catch {
      setIsTyping(false);
      addBotMessage('দুঃখিত, পণ্যের তথ্য লোড করতে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করুন।', [], 0);
    }
  };

  const handleSend = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;
    setInput('');
    addUserMessage(userText);

    if (stockPrompt) {
      await handleStockCheck(userText);
      return;
    }

    if (isStockQuery(userText)) {
      const productName = extractProductName(userText);
      await handleStockCheck(productName);
      return;
    }

    const match = findResponse(userText);
    if (match) {
      addBotMessage(match.response, match.buttons);
    } else {
      addBotMessage(
        `আপনার প্রশ্নটি ভালোভাবে বুঝতে পারিনি 🙁\n\nনিচের বিষয়গুলো সম্পর্কে জিজ্ঞেস করতে পারেন:\n• অর্ডার / Order\n• ডেলিভারি / Delivery\n• পেমেন্ট / Payment\n• পণ্যের স্টক / Product stock\n• যোগাযোগ / Contact\n\nঅথবা সরাসরি কল করুন! 📞`,
        [{ label: '📞 কল করুন', action: 'phone', value: 'tel:+8801234567890' }]
      );
    }
  };

  const handleQuickReply = async (id) => {
    if (id === 'stock_prompt') {
      addUserMessage('📦 পণ্যের স্টক চেক করতে চাই');
      setStockPrompt(true);
      addBotMessage('কোন পণ্যের স্টক চেক করতে চান? পণ্যের নাম লিখুন 👇\n_(উদাহরণ: ধান, গম, ভুট্টা, সরগাম)_', []);
      return;
    }
    const match = knowledgeBase.find(k => k.id === id);
    if (match) {
      addUserMessage(quickReplies.find(q => q.id === id)?.label || id);
      addBotMessage(match.response, match.buttons);
    }
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i, arr) => {
      const parts = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('_') && part.endsWith('_')) {
          return <em key={j} className="text-gray-500 text-xs">{part.slice(1, -1)}</em>;
        }
        return part;
      });
      return <span key={i}>{parts}{i < arr.length - 1 && <br />}</span>;
    });
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)', boxShadow: '0 8px 30px rgba(21,67,22,0.55)' }}
        title="চ্যাট সহায়তা"
      >
        {isOpen
          ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        }
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">1</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-44 right-6 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ width: '340px', maxHeight: '560px', boxShadow: '0 25px 70px rgba(0,0,0,0.25)', animation: 'chatSlideUp 0.3s cubic-bezier(0.4,0,0.2,1)' }}
        >
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)' }} className="p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🌱</div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">আলিফ সিডস সহায়তা</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <p className="text-green-200 text-xs">সবসময় আপনার পাশে 💚</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3" style={{ minHeight: '250px', maxHeight: '310px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                <div className="flex items-end gap-2">
                  {msg.from === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-green-800 text-xs flex items-center justify-center flex-shrink-0">🌱</div>
                  )}
                  <div
                    className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === 'user'
                        ? 'text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}
                    style={msg.from === 'user' ? { background: 'linear-gradient(135deg,#154316,#2a6f2e)' } : {}}
                  >
                    {formatText(msg.text)}
                  </div>
                </div>
                {/* Action Buttons inside message */}
                {msg.buttons && msg.buttons.length > 0 && (
                  <div className={`flex flex-wrap gap-1.5 mt-1 ${msg.from === 'bot' ? 'ml-9' : ''}`}>
                    {msg.buttons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(btn)}
                        className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 hover:shadow-md"
                        style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)', color: 'white' }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-green-800 text-xs flex items-center justify-center">🌱</div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="bg-white border-t border-gray-100 px-2 py-2 flex gap-1.5 overflow-x-auto flex-shrink-0">
            {quickReplies.map(q => (
              <button
                key={q.id}
                onClick={() => handleQuickReply(q.id)}
                className="flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full border border-green-200 text-green-800 hover:bg-green-50 hover:border-green-500 transition-all whitespace-nowrap font-medium"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 p-3 flex gap-2 flex-shrink-0">
            <input
              type="text"
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-700 placeholder-gray-400"
              placeholder={stockPrompt ? 'পণ্যের নাম লিখুন...' : 'বার্তা লিখুন...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              autoFocus
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity:0; transform:translateY(16px) scale(0.96); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
