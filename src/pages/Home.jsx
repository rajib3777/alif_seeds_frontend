import Hero from '../components/Hero';
import Categories from '../components/Categories';
import FeaturedSeed from '../components/FeaturedSeed';
import ProductGrid from '../components/ProductGrid';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import RecentOrders from '../components/RecentOrders';
import News from '../components/News';
import TagSection from '../components/TagSection';

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedSeed />
      
      {/* Main Seed Collection */}
      <ProductGrid />

      {/* Automated Tag-based Sections */}
      <TagSection 
        tagName="Tested" 
        title="পরিক্ষিত বীজসমূহ" 
        subtitle="verified quality" 
      />
      
      <TagSection 
        tagName="Uncommon" 
        title="আনকমন বীজসমূহ" 
        subtitle="unique collection" 
      />

      <WhyChooseUs />
      <Testimonials />
      <RecentOrders />
      <News />
    </>
  );
}
