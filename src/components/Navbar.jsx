import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useSearchStore } from '../store/useSearchStore';
import { useAuthStore } from '../store/useAuthStore';
import { CATEGORIES } from '../data/categories';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const ChevronDownIcon = ({ isOpen }) => (
  <svg className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategoryIdx, setOpenCategoryIdx] = useState(null);

  const cart = useCartStore(state => state.cart);
  const { searchQuery, setSearchQuery, setCategory } = useSearchStore();
  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const categories = CATEGORIES;

  const handleCategoryNav = (catName) => {
    setCategory(catName);
    setIsMobileMenuOpen(false);
    navigate('/products');
  };

  const handleMobileCategoryClick = (idx, hasSubs, catName) => {
    if (hasSubs) {
      setOpenCategoryIdx(openCategoryIdx === idx ? null : idx);
    } else {
      handleCategoryNav(catName);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/products') {
      navigate('/products');
    }
  };

  return (
    <div className="w-full relative z-50">
      {/* Top Bar */}
      <div className="bg-darkGreen py-3 px-4 lg:px-8 w-full border-b border-white/10 shadow-sm relative z-[60]">
        <div className="container mx-auto flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src="/logo.jpg" alt="Alif Seeds Logo"
              className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover border-2 border-gold shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = '/cat1.png'; }} />
            <h1 className="text-xl md:text-2xl font-bold font-serif tracking-wide text-gold whitespace-nowrap">Alif Seeds</h1>
          </Link>

          {/* Search Bar Desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl px-8">
            <div className="relative w-full">
              <input type="text" placeholder="পণ্য খুঁজুন..."
                value={searchQuery} onChange={handleSearch}
                className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-full py-2.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-gold shadow-inner" />
              {useSearchStore().hasNoResults && searchQuery && (
                <div className="absolute -bottom-6 left-6 text-red-400 text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full animate-bounce">
                  ⚠️ স্টকে নেই
                </div>
              )}
              <div className="absolute right-4 top-3 text-darkGreen cursor-pointer"><SearchIcon /></div>
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 md:gap-7 text-white shrink-0">
            {/* Hotline - Premium Style */}
            <a href="tel:01334642219" className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 border border-orange-400 px-5 py-2 rounded-full hover:from-gold hover:to-yellow-500 hover:text-darkGreen transition-all duration-500 shadow-[0_4px_15px_rgba(249,115,22,0.4)] group text-white">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-darkGreen/10 group-hover:text-darkGreen transition-colors animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 drop-shadow-sm">Helpline</span>
                <span className="text-lg font-black tracking-wider drop-shadow-md">01334-642219</span>
              </div>
            </a>

            <div className="hidden xl:flex items-center gap-2 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full border border-white/20 hover:border-gold transition-colors">
              <span className="text-xl">🇧🇩</span>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase">BD</span>
            </div>

            <button onClick={() => navigate(isLoggedIn ? '/account' : '/login')}
              className="hidden md:flex flex-col items-center gap-0.5 cursor-pointer hover:text-gold transition-colors text-white">
              <UserIcon />
              <span className="text-[9px] font-black uppercase tracking-widest">{isLoggedIn ? (user?.name?.split(' ')[0] || 'Profile') : 'Login'}</span>
            </button>

            {/* Cart */}
            <button onClick={() => navigate('/cart')} className="relative text-white hover:text-gold transition-all duration-300 transform hover:scale-110">
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-darkGreen text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-darkGreen shadow-lg">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden text-white hover:text-gold focus:outline-none transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Category Bar - Premium Redesign */}
      <div className="bg-[#112a1f] text-white w-full hidden lg:block border-b border-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative z-[50]">
        <div className="container mx-auto">
          <div className="flex items-center justify-center relative">
            <Link to="/" className="group px-8 py-4 hover:bg-gold/5 font-bold transition-all duration-300 uppercase text-[12px] tracking-[0.15em] flex items-center gap-2 border-x border-white/5 relative overflow-hidden">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold group-hover:scale-110 transition-transform"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
               হোম
               <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gold transition-all duration-500 group-hover:w-full"></div>
            </Link>


            {categories.map((cat, idx) => (
              <div key={idx} className="group relative">
                <button
                  onClick={() => { if (!cat.subs) handleCategoryNav(cat.label); }}
                  className="px-5 py-4 flex items-center gap-2 font-bold text-[12px] tracking-[0.12em] hover:bg-gold/5 hover:text-gold transition-all duration-300 uppercase border-r border-white/5 h-full relative overflow-hidden">
                  {cat.label}
                  {cat.subs && <ChevronDownIcon isOpen={false} />}
                  <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-gold transition-all duration-500 group-hover:w-full"></div>
                </button>
                {cat.subs && (
                  <div className="absolute top-full left-0 bg-darkGreen text-white min-w-[240px] py-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-b-2xl opacity-0 invisible translate-y-4 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-[100] border-t-2 border-gold border-x border-b border-white/10 backdrop-blur-xl bg-opacity-95">
                    {cat.subs.map((sub, i) => (
                      <div key={i} onClick={() => handleCategoryNav(sub)}
                        className="px-6 py-3.5 hover:bg-gold hover:text-darkGreen cursor-pointer font-bold text-[12px] uppercase tracking-wider transition-all duration-200 border-b border-white/5 last:border-0 flex items-center justify-between group/sub">
                        {sub}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover/sub:opacity-100 -translate-x-2 group-hover/sub:translate-x-0 transition-all"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      <div className={`lg:hidden fixed top-0 left-0 w-full bg-darkGreen shadow-2xl transition-all duration-300 z-[70] overflow-hidden ${isMobileMenuOpen ? 'max-h-[85vh] border-b-4 border-gold' : 'max-h-0'}`}>
        <div className="flex flex-col py-2 px-4 gap-2 overflow-y-auto w-full max-h-[85vh] pb-6 relative pt-4">

          <button onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-2 right-4 text-gold hover:text-white bg-black/30 p-2 rounded-full transition-colors flex items-center justify-center gap-1 z-10">
            <CloseIcon />
            <span className="text-xs font-bold uppercase">বন্ধ করুন</span>
          </button>

          <div className="mt-8"></div>

          {/* Mobile Search */}
          <div className="relative w-full my-4">
            <input type="text" placeholder="পণ্য খুঁজুন..."
              value={searchQuery} onChange={handleSearch}
              className="w-full bg-white text-gray-900 placeholder-gray-500 rounded-full py-3.5 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-gold shadow-inner" />
            {useSearchStore().hasNoResults && searchQuery && (
              <div className="absolute -bottom-5 left-6 text-red-400 text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full">
                ⚠️ স্টকে নেই বা খুঁজে পাওয়া যায়নি
              </div>
            )}
            <div className="absolute right-4 top-3.5 text-darkGreen cursor-pointer"><SearchIcon /></div>
          </div>

          <h3 className="text-gold font-bold text-sm uppercase tracking-widest mt-4 mb-2 pl-2 border-l-2 border-gold shrink-0">ক্যাটাগরি সমূহ</h3>

          {/* Categories Accordion */}
          <div className="flex flex-col gap-1 w-full relative mb-10 pb-10">
            {categories.map((cat, idx) => {
              const isOpen = openCategoryIdx === idx;
              return (
                <div key={idx} className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                  <button
                    className="w-full text-white text-left font-bold py-3.5 px-4 text-sm uppercase flex justify-between items-center bg-black/20 hover:bg-gold/20 transition-colors"
                    onClick={() => handleMobileCategoryClick(idx, !!cat.subs, cat.label)}>
                    <span className="flex items-center gap-2">{cat.label}</span>
                    {cat.subs && <ChevronDownIcon isOpen={isOpen} />}
                  </button>
                  {cat.subs && (
                    <div className={`transition-all duration-300 ease-in-out px-4 bg-black/40 overflow-hidden ${isOpen ? 'max-h-40 py-2 border-t border-white/10' : 'max-h-0 py-0'}`}>
                      {cat.subs.map((sub, i) => (
                        <div key={i} onClick={() => handleCategoryNav(sub)}
                          className="text-gray-300 py-2.5 text-sm font-semibold border-b border-white/5 last:border-0 hover:text-gold cursor-pointer pl-2">
                          • {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Fixed Bottom Navigation - Centered Design */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-[#112a1f] border-t border-gold shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-[60] px-2 py-1 flex justify-around items-end pb-safe">
        
        {/* 1. Home */}
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1 flex-1 py-1 text-white hover:text-gold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          <span className="text-[10px] font-black uppercase tracking-tighter">হোম</span>
        </Link>

        {/* 2. Search */}
        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center gap-1 flex-1 py-1 text-white hover:text-gold transition-colors">
          <SearchIcon />
          <span className="text-[10px] font-black uppercase tracking-tighter">খুঁজুন</span>
        </button>

        {/* 3. Floating Center Menu */}
        <div className="flex-1 flex justify-center -translate-y-5">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="flex flex-col items-center group">
            <div className={`p-3.5 rounded-full shadow-[0_8px_25px_rgba(235,180,85,0.4)] border-[6px] border-[#112a1f] transition-all duration-300 ${isMobileMenuOpen ? 'bg-white text-darkGreen rotate-90' : 'bg-gold text-darkGreen group-hover:scale-110'}`}>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </div>
            <span className="text-[10px] font-black text-gold uppercase mt-1.5 drop-shadow-md">মেনু</span>
          </button>
        </div>

        {/* 4. Cart */}
        <button onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-white hover:text-gold transition-colors relative">
          <CartIcon />
          <span className="text-[10px] font-black uppercase tracking-tighter">কার্ট</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-3 sm:right-6 bg-gold w-4 h-4 text-[9px] text-darkGreen font-black rounded-full flex items-center justify-center border border-[#112a1f]">
              {totalItems}
            </span>
          )}
        </button>

        {/* 5. Account */}
        <button onClick={() => { navigate(isLoggedIn ? '/account' : '/login'); setIsMobileMenuOpen(false); }}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-white hover:text-gold transition-colors">
          <UserIcon />
          <span className="text-[10px] font-black uppercase tracking-tighter">{isLoggedIn ? 'প্রোফাইল' : 'একাউন্ট'}</span>
        </button>
      </div>

    </div>
  );
}
