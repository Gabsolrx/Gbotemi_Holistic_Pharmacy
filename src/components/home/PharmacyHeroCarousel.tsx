import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cmsService } from '../../services/cmsService';

const SLIDE_DURATION = 3000; // 3 seconds per slide as requested

interface HeroSlideDisplay {
  id: number | string;
  label: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta: {
    text: string;
    link: string;
  };
  image: string;
  badges: {
    topBadge: {
      title: string;
      subtitle: string;
    };
    bottomBadge: {
      title: string;
      subtitle: string;
    };
  };
  categoryTag?: string;
}

const stripDot = (text?: string): string => {
  if (!text) return '';
  return text.replace(/\.+$/, '').trim();
};

const DEFAULT_SLIDES_DISPLAY: HeroSlideDisplay[] = [
  {
    id: 1,
    label: 'WELCOME TO GBOTEMI',
    headlineLine1: 'Your health',
    headlineLine2: 'Our priority',
    description: 'Everyday healthcare, with care you deserve.',
    primaryCta: {
      text: 'Explore Pharmacy →',
      link: '/shop',
    },
    secondaryCta: {
      text: 'Shop Wellness',
      link: '/shop?category=Wellness',
    },
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874735397_u5n2ac.jpeg',
    badges: {
      topBadge: {
        title: 'Same-Day Dispatch',
        subtitle: 'Fast delivery in Osogbo & Nationwide courier',
      },
      bottomBadge: {
        title: '100% Genuine Care',
        subtitle: 'NAFDAC regulated, authentic pharmaceutical stock',
      },
    },
    categoryTag: 'Authentic Medicines & Delivery',
  },
  {
    id: 2,
    label: 'PRESCRIPTION MADE SIMPLE',
    headlineLine1: 'Skip the hassle',
    headlineLine2: 'Start online',
    description: 'Send your prescription from anywhere.',
    primaryCta: {
      text: 'Get Started →',
      link: '/prescription',
    },
    secondaryCta: {
      text: 'How It Works',
      link: '/prescription',
    },
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874744209_rh4iuq.jpeg',
    badges: {
      topBadge: {
        title: 'Encrypted & Confidential',
        subtitle: 'Direct clinical pharmacist review',
      },
      bottomBadge: {
        title: 'Fast Verification',
        subtitle: 'Dispensing guidance within 15 minutes',
      },
    },
    categoryTag: 'Digital Prescription Assistance',
  },
  {
    id: 3,
    label: 'CARE BEYOND MEDICINES',
    headlineLine1: 'Your wellness',
    headlineLine2: 'Our priority',
    description: 'Discover wellness essentials and trusted guidance.',
    primaryCta: {
      text: 'Explore Wellness →',
      link: '/shop?category=Wellness',
    },
    secondaryCta: {
      text: 'Talk to a Pharmacist',
      link: '/consultation',
    },
    image: 'https://lwoyhhkbfmhklqrguuju.supabase.co/storage/v1/object/public/cms/hero_1787874743059_qpxpao.jpeg',
    badges: {
      topBadge: {
        title: 'Licensed Pharmacist Online',
        subtitle: 'Personalized medicine & dosage guidance',
      },
      bottomBadge: {
        title: 'Holistic Wellness Range',
        subtitle: 'Vitamins, supplements & natural remedies',
      },
    },
    categoryTag: 'Licensed Pharmacist Telehealth',
  },
];

export function PharmacyHeroCarousel() {
  const [slides, setSlides] = useState<HeroSlideDisplay[]>(DEFAULT_SLIDES_DISPLAY);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const animationFrameRef = useRef<number | null>(null);

  // Synchronize with cmsService and live Supabase config
  useEffect(() => {
    let isMounted = true;

    const loadCmsSlides = async () => {
      try {
        const config = await cmsService.getConfig();
        if (isMounted && config?.heroSlides?.length === 3) {
          const mapped: HeroSlideDisplay[] = config.heroSlides.map((s, idx) => {
            const fallback = DEFAULT_SLIDES_DISPLAY[idx] || DEFAULT_SLIDES_DISPLAY[0];
            const lines = s.title ? s.title.split('\n') : [fallback.headlineLine1, fallback.headlineLine2];
            const h1 = stripDot(s.headlineFirst || lines[0] || fallback.headlineLine1);
            const h2 = stripDot(s.headlineSecond || lines[1] || fallback.headlineLine2);

            return {
              id: s.id || fallback.id,
              label: s.label || fallback.label,
              headlineLine1: h1,
              headlineLine2: h2,
              description: s.description || fallback.description,
              primaryCta: s.primaryCta?.text ? s.primaryCta : fallback.primaryCta,
              secondaryCta: s.secondaryCta?.text ? s.secondaryCta : fallback.secondaryCta,
              image: s.image || fallback.image,
              badges: fallback.badges,
              categoryTag: fallback.categoryTag,
            };
          });
          setSlides(mapped);
        }
      } catch (e) {
        console.warn('Using default hero carousel configuration:', e);
      }
    };

    loadCmsSlides();
    window.addEventListener('cms-updated', loadCmsSlides);
    return () => {
      isMounted = false;
      window.removeEventListener('cms-updated', loadCmsSlides);
    };
  }, []);

  const currentSlide = slides[currentSlideIndex] || DEFAULT_SLIDES_DISPLAY[0];

  // Manual navigation handlers
  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [slides.length]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlideIndex) return;
    setCurrentSlideIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [currentSlideIndex]);

  // Preload all slide images immediately to eliminate any blank loading state
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.image) {
        const img = new Image();
        img.src = slide.image;
      }
    });
  }, [slides]);

  // Timer & Progress Line Animation (3-second duration)
  useEffect(() => {
    if (isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProgress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        goToNextSlide();
      } else {
        animationFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, currentSlideIndex, goToNextSlide, progress]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current === null || touchEndXRef.current === null) return;
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 40;

    if (deltaX > swipeThreshold) {
      goToNextSlide();
    } else if (deltaX < -swipeThreshold) {
      goToPrevSlide();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="GBOTEMI Holistic Pharmacy Promotions"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-[#FAF9F1] overflow-hidden pt-4 pb-6 sm:pt-6 sm:pb-10 lg:py-8 border-b border-[#047857]/10"
    >
      {/* Background Architectural Grid Pattern & Ambient Emerald Lighting */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#047857 0.75px, transparent 0.75px), radial-gradient(#064E3B 0.75px, #FAF9F1 0.75px)`,
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
            opacity: 0.16,
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#047857]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] bg-[#047857]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Container — Solid backdrop, stable height to guarantee ZERO blank white flashes */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-[#ECFDF5] shadow-sm p-5 sm:p-7 lg:p-9 relative overflow-hidden flex flex-col justify-between">
          
          {/* Two-Column Layout (Desktop) / Vertical Stack (Mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center flex-grow">
            
            {/* Left Column: Text & CTAs (Smooth crossfade without unmounting) */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-10 min-h-[260px] sm:min-h-[280px]">
              {/* Clean Service Label (No Icons) */}
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#ECFDF5] border border-[#047857]/20 text-[#047857] w-fit mb-3 sm:mb-4 shadow-2xs">
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase font-sans">
                  {currentSlide.label}
                </span>
              </div>

              {/* Bold Oversized Headline with Emerald Accent — No full stops at the end */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem] xl:text-[3.5rem] font-bold text-[#17231E] leading-[1.14] tracking-tight font-sans transition-all duration-300">
                <span className="block">
                  {currentSlide.headlineLine1}
                </span>
                <span className="block mt-1 sm:mt-1.5 text-[#047857]">
                  {currentSlide.headlineLine2}
                </span>
              </h1>

              {/* Short Supporting Sentence */}
              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#65776D] leading-relaxed max-w-lg font-normal font-sans transition-opacity duration-300">
                {currentSlide.description}
              </p>

              {/* Action Buttons: Primary & Secondary (No Icons) */}
              <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md">
                {/* Primary CTA */}
                <Link
                  to={currentSlide.primaryCta.link}
                  className="inline-flex items-center justify-center px-6 sm:px-7 py-3 rounded-xl bg-[#047857] hover:bg-[#064E3B] text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-950/15 hover:shadow-lg transition-all duration-200 active:scale-98 text-center font-sans"
                >
                  <span>{currentSlide.primaryCta.text}</span>
                </Link>

                {/* Secondary CTA */}
                <Link
                  to={currentSlide.secondaryCta.link}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white hover:bg-[#FAF9F1] text-[#047857] border border-[#047857]/30 hover:border-[#047857] font-semibold text-sm sm:text-base transition-all duration-200 shadow-2xs active:scale-98 text-center font-sans"
                >
                  <span>{currentSlide.secondaryCta.text}</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Immersive Visual with Restored Floating Glassmorphic Overlay Badges */}
            <div className="lg:col-span-6 xl:col-span-6 relative w-full">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl overflow-hidden bg-[#ECFDF5] border border-[#047857]/15 shadow-md">
                {slides.map((slide, index) => {
                  const isActive = index === currentSlideIndex;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      {/* Hero Image */}
                      <img
                        src={slide.image}
                        alt={`${slide.headlineLine1} ${slide.headlineLine2}`}
                        className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-102"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        referrerPolicy="no-referrer"
                      />

                      {/* Subtle elegant gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                      {/* Floating Glassmorphic Badge: Top Right */}
                      {slide.badges?.topBadge && (
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 max-w-[210px] sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/70 shadow-lg shadow-emerald-950/10 pointer-events-none transition-all duration-300">
                          <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
                            {slide.badges.topBadge.title}
                          </span>
                          <p className="text-[10px] sm:text-[11px] text-[#65776D] mt-0.5 leading-snug">
                            {slide.badges.topBadge.subtitle}
                          </p>
                        </div>
                      )}

                      {/* Floating Glassmorphic Badge: Bottom Left */}
                      {slide.badges?.bottomBadge && (
                        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 max-w-[230px] sm:max-w-xs bg-white/95 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/70 shadow-lg shadow-emerald-950/10 pointer-events-none transition-all duration-300">
                          <span className="text-[10px] font-bold text-[#064E3B] uppercase tracking-wider block">
                            {slide.badges.bottomBadge.title}
                          </span>
                          <p className="text-[10px] sm:text-[11px] text-[#65776D] mt-0.5 leading-snug">
                            {slide.badges.bottomBadge.subtitle}
                          </p>
                        </div>
                      )}

                      {/* Category Tag: Bottom Right */}
                      {slide.categoryTag && (
                        <div className="absolute bottom-3 right-3 z-20 hidden sm:block pointer-events-none">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
                            {slide.categoryTag}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bottom Pagination, Animated Progress Line & Carousel Controls (No Icons) */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* 3 Clickable Slide Indicators with Synchronized Progress Line */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {slides.map((slide, index) => {
                const isActive = index === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.headlineLine1}`}
                    className={`group relative flex flex-col items-start p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isActive ? 'bg-[#ECFDF5]' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className={`text-xs font-bold font-mono tabular-nums transition-colors ${
                          isActive ? 'text-[#047857]' : 'text-gray-400 group-hover:text-gray-700'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span
                        className={`text-xs font-medium transition-colors hidden md:inline font-sans ${
                          isActive ? 'text-[#17231E]' : 'text-[#65776D]'
                        }`}
                      >
                        {index === 0 ? 'Pharmacy' : index === 1 ? 'Prescription' : 'Wellness'}
                      </span>
                    </div>

                    {/* Progress Track & Animated Filling Line (3 seconds) */}
                    <div className="w-16 sm:w-20 lg:w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden relative">
                      {isActive && (
                        <div
                          className="h-full bg-[#047857] rounded-full transition-all duration-75 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                      {!isActive && index < currentSlideIndex && (
                        <div className="h-full w-full bg-[#047857]/40 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Previous / Next Navigation Controls (Text Buttons, No Icons) */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {isPaused && (
                <span className="text-[11px] text-[#65776D] font-medium hidden sm:inline-block font-sans">
                  Paused
                </span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goToPrevSlide}
                  aria-label="Previous slide"
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-[#FAF9F1] hover:border-[#047857]/40 text-[#17231E] hover:text-[#047857] text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer font-sans"
                >
                  Prev
                </button>

                <button
                  type="button"
                  onClick={goToNextSlide}
                  aria-label="Next slide"
                  className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-[#FAF9F1] hover:border-[#047857]/40 text-[#17231E] hover:text-[#047857] text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer font-sans"
                >
                  Next
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
