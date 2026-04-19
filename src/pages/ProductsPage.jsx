import ProductGrid from '../components/ProductGrid';
import { useEffect } from 'react';

export default function ProductsPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-8 bg-darkGreen min-h-screen">
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-center text-white font-serif mb-2">প্রোডাক্ট গ্যালারি</h1>
        <p className="text-center text-gold font-semibold uppercase tracking-widest text-sm">Alif Seeds Exclusive Collection</p>
      </div>
      <ProductGrid />
    </div>
  );
}
