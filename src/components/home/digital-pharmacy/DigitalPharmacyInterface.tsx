import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { SmartMedicineSearch } from './SmartMedicineSearch';
import { FeaturedProductCard } from './FeaturedProductCard';
import { PrescriptionAssistanceCard } from './PrescriptionAssistanceCard';
import { PharmacistConsultationCard } from './PharmacistConsultationCard';
import { DeliveryOptionsCard } from './DeliveryOptionsCard';
import { productService } from '../../../services/productService';
import { Product } from '../../../types';
import { ShieldCheck, Sparkles, Activity } from 'lucide-react';

export function DigitalPharmacyInterface() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Subtle interactive parallax for floating elements on desktop
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);
  const reverseParallaxX = useTransform(smoothX, [-0.5, 0.5], [6, -6]);
  const reverseParallaxY = useTransform(smoothY, [-0.5, 0.5], [6, -6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const data = await productService.getProducts();
        if (isMounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error('Failed to load products for hero preview:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products based on search query or category
  const displayedProducts = useMemo(() => {
    let filtered = products;

    if (activeCategory !== 'all') {
      const catLower = activeCategory.toLowerCase();
      filtered = filtered.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return pCat.includes(catLower) || (catLower.includes('supplements') && pCat.includes('vitamin'));
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.genericName && p.genericName.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Limit to 4 cards for a balanced layout
    return filtered.slice(0, 4);
  }, [products, activeCategory, searchQuery]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl bg-gradient-to-br from-[#FAF8F0]/90 via-[#FAF8F0]/50 to-[#DDF5E8]/30 backdrop-blur-xl border border-emerald-900/10 p-3 sm:p-5 lg:p-6 shadow-sm overflow-hidden"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#087F5B]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#C5E86C]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Live Trust Badge */}
      <motion.div
        style={{ x: parallaxX, y: parallaxY }}
        className="hidden sm:flex absolute top-4 right-4 z-20 items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full border border-emerald-900/10 shadow-2xs text-[11px] font-semibold text-[#064E3B]"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Verified Inventory & Active Dispensing</span>
      </motion.div>

      <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
        {/* Top: Smart Medicine Search */}
        <SmartMedicineSearch
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Middle: Featured Inventory Grid (2x2 on sm/md/lg) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#17231E]">
              <Activity size={14} className="text-[#087F5B]" />
              <span>Available in Store</span>
            </div>
            <span className="text-[11px] text-[#65776D] font-medium">
              Showing {displayedProducts.length} items
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 min-h-[260px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white/60 animate-pulse rounded-2xl h-52 border border-gray-100 p-4"
                />
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {displayedProducts.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 text-xs text-[#65776D]">
              No exact matches found. Try selecting "All Products" or another category.
            </div>
          )}
        </div>

        {/* Bottom Asymmetric Service Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <motion.div style={{ x: reverseParallaxX, y: reverseParallaxY }}>
            <PrescriptionAssistanceCard className="h-full" />
          </motion.div>

          <div className="flex flex-col gap-3">
            <PharmacistConsultationCard />
            <DeliveryOptionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
