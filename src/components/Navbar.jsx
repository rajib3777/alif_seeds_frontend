import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cart = useCartStore(state => state.cart);
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'হোম', href: '/' },
    { label: 'আমাদের বীজ', href: '/#products' },
    { label: 'ফিচার', href: '/#features' },
    { label: 'রিভিউ', href: '/#reviews' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-darkGreen shadow-xl py-3' : 'bg-darkGreen/80 backdrop-blur-sm py-5'}`}>
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <img
              src="/logo.jpg"
              alt="Alif Seeds Logo"
              className="w-14 h-14 rounded-md border-2 border-gold object-cover shadow-lg"
              onError={(e) => { e.target.onerror = null; e.target.src = '/cat1.png'; }}
            />
            <div>
              <h1 className="text-2xl font-bold font-serif tracking-wide text-gold">Alif Seeds</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300">Agro Service</p>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-white hover:text-gold font-bold text-sm uppercase tracking-wide transition-colors">
                {link.label}
              </a>
            ))}
            
            {/* CART BUTTON */}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-white hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-darkGreen text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="bg-gold text-darkGreen px-6 py-2.5 rounded font-bold hover:bg-yellow-400 transition-all shadow-[0_4px_15px_rgba(235,180,85,0.3)] text-sm ml-2"
            >
              অর্ডার করুন
            </button>
          </div>

          {/* MOBILE: cart + hamburger */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => navigate('/cart')} className="relative text-white hover:text-gold transition-colors">
              <CartIcon />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold text-darkGreen text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className="text-white hover:text-gold focus:outline-none transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-darkGreen shadow-2xl border-t-2 border-gold z-50">
          <div className="flex flex-col py-6 px-6 gap-5">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-white hover:text-gold font-bold uppercase block text-lg border-b border-gray-700 pb-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => { navigate('/cart'); setIsMobileMenuOpen(false); }}
              className="bg-gold text-darkGreen px-6 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg w-full text-center text-lg uppercase tracking-wide mt-2"
            >
              🛒 কার্ট দেখুন ({totalItems})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
