import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// =============================================
// SYNONYM MAP — understands English, Banglish, misspellings & Bangla
// =============================================
const synonymMap = [
  { patterns: ['rice','rais','ries','rize','dhan','dhaan','daan','dan','daan bij','dhanbi','dhan seed','dhan bij','chan','paddy'], bangla: 'ধান' },
  { patterns: ['wheat','weat','wheet','gom','gom bij','goum','gam','gum','gum bij','whet'], bangla: 'গম' },
  { patterns: ['corn','maize','bhutta','bhuttta','bhutra','bhuta','vituta','butta','vutta','vuta','corn seed','maize seed','bhuttar'], bangla: 'ভুট্টা' },
  { patterns: ['sorgum','sorghum','sorgham','sudan','sultan','sudan grass','sarghum','sergam','sorhum','sorgam','sorham','surgum'], bangla: 'সরগাম' },
  { patterns: ['vegetable','vegitable','vejetable','shobji','sobji','sobzi','shobji bij','veg','veges','sabzi','shak'], bangla: 'সবজি' },
  { patterns: ['tomato','tomate','tometo','tamato','tometo','tometo seed'], bangla: 'টমেটো' },
  { patterns: ['mustard','sarisha','sarsa','sarso','sarisha bij','mustrad','mustered'], bangla: 'সরিষা' },
  { patterns: ['lentil','masur','masor','masoor','dal','daal','moosur'], bangla: 'মসুর' },
  { patterns: ['potato','alu','aloo','poteto','alu bij','aloo seed'], bangla: 'আলু' },
  { patterns: ['onion','piaz','peyaz','piyaz','onion seed','onin','peaz'], bangla: 'পেঁয়াজ' },
  { patterns: ['chili','chilli','morich','mirchi','chili seed','red chili','moric','moris'], bangla: 'মরিচ' },
  { patterns: ['garlic','rasun','rashun','rasoon','garlik'], bangla: 'রসুন' },
  { patterns: ['jute','pat','paat','jut bij'], bangla: 'পাট' },
  { patterns: ['cauliflower','phulkopi','phoolkopi','fulkopi'], bangla: 'ফুলকপি' },
  { patterns: ['cabbage','badhakopi','batha kopi','patakofi'], bangla: 'বাঁধাকপি' },
  { patterns: ['bitter gourd','karela','karolla','karola','uchhe'], bangla: 'করলা' },
  { patterns: ['eggplant','brinjal','begun','begun','brinzal','egg plant'], bangla: 'বেগুন' },
  { patterns: ['okra','dherosh','dherosh bij','lady finger','dharosh','dheros'], bangla: 'ঢেঁড়স' },
  { patterns: ['cucumber','sasa','shasha','kheera','khira','cucumba'], bangla: 'শসা' },
  { patterns: ['gourd','lau','laau','bottle gourd','lav'], bangla: 'লাউ' },
  { patterns: ['spinach','palak','shaak','palong','palong shaak'], bangla: 'পালং শাক' },
  { patterns: ['sunflower','surajmukhi','helianthus','sunflowa','shunflower'], bangla: 'সূর্যমুখী' },
];

// Normalize query: map to Bangla equivalent or return as-is
function normalizeSynonym(text) {
  const lower = text.toLowerCase().trim();
  for (const entry of synonymMap) {
    if (entry.patterns.some(p => lower.includes(p))) return entry.bangla;
  }
  return lower;
}

// Fuzzy character match (handles minor typos)
// Fuzzy character match (only for longer strings to avoid false positives)
function fuzzyMatch(productName, query) {
  const pn = productName.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q || q.length < 3) return false; // Ignore very short queries for fuzzy
  if (pn.includes(q) || q.includes(pn)) return true;
  
  // Standard Levenshtein-style check would be better, but for now we'll just 
  // stick to stricter substring or word-based matches to avoid junk results.
  return false; 
}

// =============================================
// KNOWLEDGE BASE — bilingual Q&A
// =============================================
const knowledgeBase = [
  {
    id: 'salam',
    test: t => /সালাম|salam|assalamu/.test(t),
    response: `ওয়ালাইকুম আসসালাম! 👋 আমি **সুবর্ণা 👩**, আলিফ সিডস থেকে।\n\nআমি আপনাকে সাহায্য করতে পারব:\n🌿 পণ্যের স্টক ও দাম জানতে\n🛒 কিভাবে অর্ডার করবেন\n🚚 ডেলিভারি চার্জ ও সময়\n💳 পেমেন্ট পদ্ধতি\n🌾 বীজ সম্পর্কিত যেকোনো তথ্য\n\nনিচের বাটনে চাপুন বা সরাসরি লিখুন! 😊`,
    buttons: []
  },
  {
    id: 'namaskar',
    test: t => /নমস্কার|namaskar|nomoskar/.test(t),
    response: `নমস্কার! 👋 আমি **সুবর্ণা 👩**, আলিফ সিডস থেকে।\n\nআমি আপনাকে সাহায্য করতে পারব:\n🌿 পণ্যের স্টক ও দাম জানতে\n🛒 কিভাবে অর্ডার করবেন\n🚚 ডেলিভারি চার্জ ও সময়\n💳 পেমেন্ট পদ্ধতি\n🌾 বীজ সম্পর্কিত যেকোনো তথ্য\n\nনিচের বাটনে চাপুন বা সরাসরি লিখুন! 😊`,
    buttons: []
  },
  {
    id: 'greeting',
    test: t => /হ্যালো|হাই|hello|hi\b|hey\b|good morning|good evening|শুভ সকাল|শুভ সন্ধ্যা/.test(t),
    response: `হ্যালো! 👋 আমি **সুবর্ণা 👩**, আলিফ সিডস থেকে।\n\nআমি আপনাকে সাহায্য করতে পারব:\n🌿 পণ্যের স্টক ও দাম জানতে\n🛒 কিভাবে অর্ডার করবেন\n🚚 ডেলিভারি চার্জ ও সময়\n💳 পেমেন্ট পদ্ধতি\n🌾 বীজ সম্পর্কিত যেকোনো তথ্য\n\nনিচের বাটনে চাপুন বা সরাসরি লিখুন! 😊`,
    buttons: []
  },
  {
    id: 'kemon_acho',
    test: t => /কেমন|kemon|valo acho|how are/.test(t),
    response: `আমি ভালো আছি, আলহামদুলিল্লাহ! আপনি কেমন আছেন? 😊`,
    buttons: []
  },
  {
    id: 'order',
    test: t => /অর্ডার|order|কিনতে|কিনব|কিভাবে|kivabe|কেনা|buy|purchase|cart|কার্ট|checkout|চেকআউট|how to buy|how to order/.test(t),
    response: `📦 **অর্ডার করার সহজ ধাপগুলো:**\n\n**➊** পছন্দের পণ্যে ক্লিক করুন\n**➋** "কার্টে যোগ করুন" বাটন চাপুন\n**➌** কার্ট পেজে পরিমাণ ঠিক করুন\n**➍** "চেকআউট করুন" চাপুন\n**➎** নাম, ফোন ও ঠিকানা দিন\n**➏** ডেলিভারি জোন বেছে "অর্ডার দিন" চাপুন ✅\n\nএখনই শুরু করুন 👇`,
    buttons: [
      { label: '🌿 পণ্য দেখুন', action: 'navigate', path: '/' },
      { label: '🛍️ কার্ট দেখুন', action: 'navigate', path: '/cart' }
    ]
  },
  {
    id: 'delivery',
    test: t => /ডেলিভারি|delivery|চার্জ|charge|শিপিং|shipping|পৌঁছাবে|courier|কুরিয়ার|ফ্রি ডেলিভারি|free delivery|কত টাকা লাগবে/.test(t),
    response: `🚚 **ডেলিভারি চার্জ:**\n\n🏙️ ঢাকা সিটি → **৭০৳**\n🌆 ঢাকা সাবার্ব → **১০০৳**\n🗺️ ঢাকার বাইরে → **১২০৳**\n\n⚖️ অতিরিক্ত ওজন: প্রতি কেজিতে **+১০৳**\n\n🎉 **৫ কেজি বা বেশি অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি!**\n\n⏱️ ডেলিভারি সময়: **২–৫ কার্যদিবস**`,
    buttons: [{ label: '🛒 এখনই অর্ডার করুন', action: 'navigate', path: '/' }]
  },
  {
    id: 'payment',
    test: t => /পেমেন্ট|payment|bkash|বিকাশ|নগদ|nagad|ক্যাশ|cash|how to pay|pay method|টাকা দেব/.test(t),
    response: `💳 **পেমেন্ট পদ্ধতি:**\n\n✅ **ক্যাশ অন ডেলিভারি** — পণ্য পাওয়ার পরে টাকা দিন\n\nকোনো অ্যাডভান্স পেমেন্ট নেই! সম্পূর্ণ ঝামেলামুক্ত! 😊\n\n_বিকাশ / নগদ শীঘ্রই চালু হবে!_`,
    buttons: [{ label: '📦 অর্ডার করুন', action: 'navigate', path: '/' }]
  },
  {
    id: 'return',
    test: t => /রিটার্ন|return|ফেরত|বাতিল|cancel|ক্যান্সেল|নষ্ট|damage|wrong|refund|রিফান্ড|exchange/.test(t),
    response: `🔄 **রিটার্ন ও বাতিল নীতি:**\n\n✅ পণ্য নষ্ট বা ভুল এলে ফেরত পাবেন\n✅ পণ্য পাওয়ার **২৪ ঘণ্টার মধ্যে** জানাতে হবে\n✅ ছবিসহ আমাদের ফোনে জানান\n✅ নতুন পণ্য পাঠানো হবে বিনামূল্যে\n\nআমরা আপনার সমস্যা সমাধান করতে প্রতিশ্রুতিবদ্ধ! 💚`,
    buttons: [{ label: '📞 যোগাযোগ করুন', action: 'phone', value: 'tel:01334642219' }]
  },
  {
    id: 'contact',
    test: t => /ফোন|phone|যোগাযোগ|contact|নম্বর|number|কল করব|call|হেল্প|help|সাহায্য|support|email|ইমেইল/.test(t),
    response: `📞 **যোগাযোগের তথ্য:**\n\n📱 ফোন: **01334642219**\n📧 ইমেইল: **info@alifseeds.com**\n🕐 সময়: সকাল ৯টা – রাত ৯টা\n📅 সপ্তাহের ৭ দিন খোলা`,
    buttons: [{ label: '📞 এখনই কল করুন', action: 'phone', value: 'tel:01334642219' }]
  },
  {
    id: 'about',
    test: t => /আলিফ|alif|সম্পর্কে|about|company|কোম্পানি|কারা|who are|what is|কোথায়|where|bangladesh/.test(t),
    response: `🌱 **আলিফ সিডস সম্পর্কে:**\n\nবাংলাদেশের একটি **বিশ্বস্ত বীজ বাজার** যা কৃষকদের উন্নত বীজ সরবরাহ করে।\n\n🌾 **পণ্য তালিকা:**\nধান · গম · ভুট্টা · সরগাম · সবজি বীজ · ফলের বীজ · তেল ফসল বীজ\n\n⭐ **কেন আলিফ সিডস?**\n✅ মানের নিশ্চয়তা  ✅ সেরা দাম\n✅ দ্রুত ডেলিভারি  ✅ বিশ্বস্ত সেবা`,
    buttons: [{ label: '🌿 পণ্য দেখুন', action: 'navigate', path: '/' }]
  },
  {
    id: 'price',
    test: t => /দাম|price|মূল্য|cost|কত|rate|রেট|সস্তা|cheap|ছাড়|offer|অফার|affordable|কমদামে/.test(t) && !/ডেলিভারি|delivery/.test(t),
    response: `💰 **দাম সম্পর্কে:**\n\nসব পণ্যের দাম পণ্য পেজে সরাসরি দেখতে পাবেন।\n\n🎉 **বিশেষ সুবিধা:**\n• বেশি পরিমাণে কিনলে সাশ্রয়\n• **৫ কেজি+** অর্ডারে ডেলিভারি ফ্রি!\n\nনিচে ক্লিক করে সব দাম দেখুন 👇`,
    buttons: [{ label: '💸 পণ্যের দাম দেখুন', action: 'navigate', path: '/' }]
  },
  {
    id: 'track',
    test: t => /ট্র্যাক|track|অর্ডার কোথায়|status|স্ট্যাটাস|কখন আসবে|when will|delivery status|কত সময়/.test(t),
    response: `📍 **অর্ডার ট্র্যাকিং:**\n\nঅর্ডার দেওয়ার পর আমাদের টিম আপনার ফোনে **কনফার্মেশন কল** দেবে।\n\n📞 ডেলিভারির আগেও জানানো হবে।\n📱 যেকোনো আপডেটের জন্য ফোন করুন।`,
    buttons: [{ label: '📞 কল করুন', action: 'phone', value: 'tel:01334642219' }]
  },
  {
    id: 'seed_info',
    test: t => /বীজ লাগানো|কিভাবে লাগাব|চাষ|farming|cultivation|grow|রোপণ|বপন|sowing|planting|fertilizer|সার|কখন লাগাব|when to plant/.test(t),
    response: `🌱 **বীজ চাষের সাধারণ টিপস:**\n\n🌧️ **বপনের সময়:**\n• ধান: আষাঢ়–শ্রাবণ (বোরো: পৌষ–মাঘ)\n• গম: অগ্রহায়ণ–পৌষ\n• ভুট্টা: রবি ও খরিপ উভয় মৌসুম\n• সবজি: বারোমাসি রকম ভেদে আলাদা\n\n💡 **পরামর্শ:** নির্দিষ্ট পণ্যের নাম বললে আরও বিস্তারিত জানাতে পারব!\n\nআমাদের বিশেষজ্ঞদের সাথে কথা বলুন 👇`,
    buttons: [{ label: '📞 বিশেষজ্ঞের পরামর্শ', action: 'phone', value: 'tel:01334642219' }]
  },
];

const quickReplies = [
  { label: '🛒 অর্ডার করব', id: 'order' },
  { label: '🚚 ডেলিভারি চার্জ', id: 'delivery' },
  { label: '💳 পেমেন্ট', id: 'payment' },
  { label: '📦 স্টক চেক', id: 'stock_prompt' },
  { label: '📞 যোগাযোগ', id: 'contact' },
  { label: '🌱 চাষ পরামর্শ', id: 'seed_info' },
  { label: '📞 আমাকে কল করুন', id: 'call_now' },
];

function findKnowledge(text) {
  const t = text.toLowerCase();
  // Check if it's a product synonym (auto-trigger stock search)
  for (const s of synonymMap) {
    if (s.patterns.some(p => t.includes(p))) return '__stock__';
  }
  // Check Bengali product names directly
  const banglaProducts = ['ধান','গম','ভুট্টা','সরগাম','সবজি','টমেটো','সরিষা','মসুর','আলু','পেঁয়াজ','মরিচ','রসুন','পাট','ফুলকপি','বাঁধাকপি','করলা','বেগুন','ঢেঁড়স','শসা','লাউ','পালং','সূর্যমুখী'];
  if (banglaProducts.some(p => t.includes(p))) return '__stock__';

  for (const k of knowledgeBase) {
    if (k.test(t)) return k;
  }
  return null;
}

function isStockRelated(text) {
  const t = text.toLowerCase();
  const stockWords = ['স্টক','stock','আছে','পাওয়া যায়','পাব','available','আছে কি','bij ache','seed available'];
  if (stockWords.some(w => t.includes(w))) return true;
  for (const s of synonymMap) {
    if (s.patterns.some(p => t.includes(p))) return true;
  }
  const banglaProducts = ['ধান','গম','ভুট্টা','সরগাম','সবজি','টমেটো','সরিষা','মসুর','আলু','পেঁয়াজ','মরিচ','রসুন'];
  return banglaProducts.some(p => t.includes(p));
}

function getSearchQuery(text) {
  const synorm = normalizeSynonym(text);
  if (synorm !== text.toLowerCase().trim()) return synorm;
  // Remove junk words
  const junk = ['স্টক','stock','আছে','আছে কি','আছে কিনা','পাওয়া যায়','পাব','available','কি','কিনা','বীজের','বীজ','seed','bij','এর','er','in','of','out','is','that','আমাকে','দেখাও','চেক','check'];
  let q = text.toLowerCase();
  for (const w of junk) q = q.replace(new RegExp(`\\b${w}\\b`, 'gi'), '').trim();
  return normalizeSynonym(q.trim() || text.trim());
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{
    id: 1, from: 'bot', time: new Date(), buttons: [],
    text: `হ্যালো! 👋 আমি **সুবর্ণা 👩**, আলিফ সিডস থেকে।\n\nআমাকে যেকোনো বিষয় জিজ্ঞেস করুন — বাংলায়, ইংরেজিতে বা বাংলিশে! পণ্যের নাম লিখলে সাথে সাথে স্টক চেক করব। 🌿`
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [stockMode, setStockMode] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const addBot = (text, buttons = [], delay = 500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(p => [...p, { id: Date.now(), from: 'bot', text, buttons, time: new Date() }]);
    }, delay);
  };

  const addUser = (text) => setMessages(p => [...p, { id: Date.now(), from: 'user', text, buttons: [], time: new Date() }]);

  const handleAction = (btn) => {
    if (btn.action === 'navigate') { setIsOpen(false); navigate(btn.path); }
    else if (btn.action === 'phone') { window.location.href = btn.value; }
    else if (btn.action === 'view_product') { setIsOpen(false); navigate(`/product/${btn.productId}`); }
  };

  const doStockCheck = async (rawQuery) => {
    const query = normalizeSynonym(rawQuery);
    setIsTyping(true);
    setStockMode(false);
    try {
      const res = await api.get('products/');
      const all = res.data;
      
      // Filter logic: 
      // 1. Must contain the normalized query (e.g. "ধান")
      // 2. OR must contain the raw English query (e.g. "rice")
      // 3. Category match must be exact or very close
      const matched = all.filter(p => {
        const name = p.name.toLowerCase();
        const cat = (p.category_name || '').toLowerCase();
        const q = query.toLowerCase();
        const r = rawQuery.toLowerCase();
        
        // Stricter filtering
        return name.includes(q) || 
               name.includes(r) || 
               (cat && (cat === q || cat === r)) ||
               fuzzyMatch(name, q) || 
               fuzzyMatch(name, r);
      });
      setIsTyping(false);
      if (!matched.length) {
        addBot(
          `দুঃখিত! **"${rawQuery}"** নামে কোনো পণ্য পাইনি।\n\nঅন্য নাম দিয়ে চেষ্টা করুন যেমন: ধান, গম, ভুট্টা, সরগাম ইত্যাদি।`,
          [{ label: '🌿 সব পণ্য দেখুন', action: 'navigate', path: '/' }], 0
        );
      } else {
        const lines = matched.slice(0, 5).map(p =>
          `${p.in_stock ? '✅' : '❌'} **${p.name}** — ৳${p.price}/${p.unit || 'কেজি'} — ${p.in_stock ? 'স্টকে আছে' : 'স্টক শেষ'}`
        ).join('\n');
        const btns = matched.slice(0, 3).map(p => ({ label: `👁️ ${p.name.slice(0, 12)}...`, action: 'view_product', productId: p.id }));
        if (matched.some(p => p.in_stock)) {
          btns.push({ label: '🛒 অর্ডার করুন', action: 'navigate', path: `/product/${matched.find(p => p.in_stock).id}` });
        }
        addBot(`🔍 **"${rawQuery}" এর ফলাফল (${matched.length}টি):**\n\n${lines}`, btns, 0);
      }
    } catch {
      setIsTyping(false);
      addBot('পণ্যের তথ্য লোড করতে সমস্যা হচ্ছে। একটু পরে চেষ্টা করুন।', [], 0);
    }
  };

  const handleSend = async (text) => {
    const userText = (text !== undefined ? text : input).trim();
    if (!userText) return;
    setInput('');
    addUser(userText);

    if (stockMode) { await doStockCheck(userText); return; }
    if (isStockRelated(userText)) { await doStockCheck(getSearchQuery(userText)); return; }

    const match = findKnowledge(userText);
    if (match === '__stock__') { await doStockCheck(getSearchQuery(userText)); return; }
    if (match) { addBot(match.response, match.buttons); return; }

    addBot(
      `বুঝতে পারিনি 🙁 তবে নিচের যেকোনো বিষয়ে জিজ্ঞেস করতে পারেন:\n\n• **অর্ডার করার নিয়ম** / How to order\n• **ডেলিভারি চার্জ** / Delivery charge\n• **পেমেন্ট** / Payment\n• **পণ্যের নাম** (যেমন: dhan, rice, ধান, gom)\n• **যোগাযোগ** / Contact\n\nঅথবা সরাসরি কল করুন! 📞`,
      [{ label: '📞 কল করুন', action: 'phone', value: 'tel:01334642219' }]
    );
  };

  const handleQuick = (id) => {
    if (id === 'stock_prompt') {
      addUser('📦 পণ্যের স্টক চেক করতে চাই');
      setStockMode(true);
      addBot('কোন পণ্যের স্টক চেক করতে চান?\n_(উদাহরণ: rice, dhan, ধান, gom, corn...)_', []);
      return;
    }
    if (id === 'call_now') {
      addUser('📞 আমাকে কল করুন');
      addBot('আমাদের হেল্পলাইন নাম্বারে কল করুন!', [{ label: '📞 কল করুন', action: 'phone', value: 'tel:01334642219' }]);
      return;
    }
    const k = knowledgeBase.find(x => x.id === id);
    if (k) {
      addUser(quickReplies.find(q => q.id === id)?.label || id);
      addBot(k.response, k.buttons);
    }
  };

  const fmt = (text) => text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={j}>{part.slice(2, -2)}</strong>
          : part.startsWith('_') && part.endsWith('_')
          ? <em key={j} className="text-gray-400 text-xs">{part.slice(1, -1)}</em>
          : part
      )}
      {i < arr.length - 1 && <br />}
    </span>
  ));

  // Compute max-height of chat window dynamically
  // Phone button: bottom-6 (24px), Chat button: bottom-24 (96px)
  // Window sits just above chat button with 8px gap
  const chatWindowStyle = {
    position: 'fixed',
    right: '24px',
    bottom: '112px',       // just above chat button (96px) + 16px gap
    width: '340px',
    maxHeight: 'calc(100vh - 130px)', // never exceed viewport
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
    zIndex: 50,
    animation: 'chatIn 0.28s cubic-bezier(0.4,0,0.2,1)',
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)', boxShadow: '0 6px 24px rgba(21,67,22,0.5)', bottom: '96px', right: '24px' }}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
        title="চ্যাট সহায়তা"
      >
        {isOpen
          ? <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
        }
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse">1</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={chatWindowStyle}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)', flexShrink: 0 }} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg flex-shrink-0">👩</div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm leading-tight">সুবর্ণা 👩</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></div>
                  <p className="text-green-200 text-xs text-nowrap">সবসময় আপনার পাশে 💚</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a href="tel:01334642219" className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all" title="কল করুন">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-2.5" style={{ minHeight: '180px' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col gap-1 ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2">
                  {msg.from === 'bot' && <div className="w-6 h-6 rounded-full bg-green-800 text-xs flex items-center justify-center flex-shrink-0 mb-0.5">👩</div>}
                  <div
                    className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.from === 'user' ? 'text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'}`}
                    style={msg.from === 'user' ? { background: 'linear-gradient(135deg,#154316,#2a6f2e)' } : {}}
                  >{fmt(msg.text)}</div>
                </div>
                {msg.buttons?.length > 0 && (
                  <div className={`flex flex-wrap gap-1.5 ${msg.from === 'bot' ? 'ml-8' : ''}`}>
                    {msg.buttons.map((btn, i) => (
                      <button key={i} onClick={() => handleAction(btn)}
                        className="text-xs px-2.5 py-1.5 rounded-full font-medium transition-all hover:scale-105 hover:shadow-md"
                        style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)', color: 'white' }}>
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-green-800 text-xs flex items-center justify-center">👩</div>
                <div className="bg-white px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex gap-1">{[0,150,300].map(d => <div key={d} className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{animationDelay:`${d}ms`}}/>)}</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef}/>
          </div>

          {/* Quick Replies / Suggestions */}
          <div className="bg-white border-t border-gray-100 px-2 py-2.5 flex gap-2 overflow-x-auto flex-shrink-0 chat-suggestions no-scrollbar" 
               style={{ WebkitOverflowScrolling: 'touch', scrollSnapType: 'x mandatory' }}>
            {quickReplies.map(q => (
              <button key={q.id} onClick={() => handleQuick(q.id)}
                className="flex-shrink-0 text-xs px-2 py-1 rounded-full border border-green-200 text-green-800 hover:bg-green-50 hover:border-green-500 transition-all whitespace-nowrap font-medium">
                {q.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-3 py-2 flex gap-2 flex-shrink-0">
            <input ref={inputRef} type="text"
              className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-green-400 text-gray-700 placeholder-gray-400"
              placeholder={stockMode ? 'পণ্যের নাম লিখুন (dhan, rice...)' : 'বাংলা বা English-এ লিখুন...'}
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={() => handleSend()} disabled={!input.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#154316,#2a6f2e)' }}>
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn {
          from { opacity:0; transform:translateY(12px) scale(0.97); }
          to { opacity:1; transform:translateY(0) scale(1); }
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #154316; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        
        /* Enable horizontal scroll on desktop more clearly */
        .chat-suggestions {
          scrollbar-width: thin;
          scrollbar-color: #154316 transparent;
        }
        .chat-suggestions::-webkit-scrollbar {
          height: 6px;
        }
        .chat-suggestions::-webkit-scrollbar-thumb {
          background: #2a6f2e;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
