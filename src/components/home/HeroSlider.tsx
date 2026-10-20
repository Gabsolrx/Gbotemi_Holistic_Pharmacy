import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { cmsService, HeroSlide } from '../../services/cmsService';

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await cmsService.getConfig();
      setSlides(config.heroSlides);
    };
    loadConfig();

    const handleUpdate = () => loadConfig();
    window.addEventListener('cms-updated', handleUpdate);
    return () => window.removeEventListener('cms-updated', handleUpdate);
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full h-[500px] md:h-[600px] bg-gray-900 overflow-hidden group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
            currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
              <div className="max-w-2xl transform transition-all duration-700 translate-y-0 opacity-100">
                <h1 
                  className={cn("mb-6 leading-tight font-bold", slide.styles?.titleSize || "text-3xl sm:text-4xl md:text-5xl lg:text-6xl", slide.styles?.titleFont || "font-sans")}
                  style={{ color: slide.styles?.titleColor || '#ffffff' }}
                >
                  {slide.title}
                </h1>
                <p 
                  className="text-lg sm:text-xl mb-8 max-w-xl"
                  style={{ color: slide.styles?.descColor || '#e5e7eb' }}
                >
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  {slide.primaryCta.text && (
                    <Link 
                      to={slide.primaryCta.link || '/shop'}
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      {slide.primaryCta.text}
                    </Link>
                  )}
                  {slide.secondaryCta?.text && (
                    <Link 
                      to={slide.secondaryCta.link || '/shop'}
                      className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 border border-white/20 transition-colors backdrop-blur-sm"
                    >
                      {slide.secondaryCta.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                currentSlide === index 
                  ? "bg-white w-8" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
