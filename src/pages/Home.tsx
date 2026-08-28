import { HeroSlider } from '../components/home/HeroSlider';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { HomeCTAs } from '../components/home/HomeCTAs';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSlider />
      <TrustIndicators />
      <CategoryShowcase />
      <FeaturedProducts />
      <HomeCTAs />
    </div>
  );
}
