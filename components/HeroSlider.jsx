'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [textVisible, setTextVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Default slide jika belum ada data
  const defaultSlides = [
    {
      id: 'default-1',
      type: 'color',
      background: 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)',
      title: 'Pisang Ijo Khas Makassar',
      subtitle: 'Kelezatan tradisional yang menyegarkan, dibuat dengan cinta dan resep turun temurun',
      isActive: true,
      order: 1
    }
  ];

  // Auto-advance to next slide
  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    
    setTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTextVisible(true);
    }, 200);
  }, [slides.length]);

  // Manual next slide with pause
  const nextSlideManual = useCallback(() => {
    if (slides.length <= 1) return;
    
    // Pause auto-slide briefly when user manually navigates
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000); // Resume after 8 seconds
    
    nextSlide();
  }, [nextSlide, slides.length]);

  // Manual navigation functions
  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    
    // Pause auto-slide briefly when user manually navigates
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000); // Resume after 8 seconds
    
    setTextVisible(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTextVisible(true);
    }, 200);
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    if (index === currentSlide || slides.length <= 1) return;
    
    // Pause auto-slide briefly when user manually navigates
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000); // Resume after 8 seconds
    
    setTextVisible(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setTextVisible(true);
    }, 200);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [nextSlide, slides.length, isPaused]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/hero-slides');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched slides data:', data);
        if (data.slides && data.slides.length > 0) {
          const activeSlides = data.slides.filter(slide => slide.isActive).sort((a, b) => a.order - b.order);
          console.log('Active slides received:', activeSlides);
          
          // Validate each slide with detailed debugging
          activeSlides.forEach((slide, index) => {
            console.log(`=== SLIDE ${index} VALIDATION ===`);
            console.log('Full slide object:', slide);
            console.log('Slide properties:', {
              id: slide._id,
              type: slide.type,
              background: slide.background,
              backgroundType: typeof slide.background,
              backgroundLength: slide.background?.length,
              imageUrl: slide.imageUrl,
              imageUrlType: typeof slide.imageUrl,
              title: slide.title,
              isActive: slide.isActive
            });
            
            // Test background validity
            if (slide.type === 'color') {
              console.log('Background validation for color slide:');
              console.log('  - Has background:', !!slide.background);
              console.log('  - Background value:', JSON.stringify(slide.background));
              console.log('  - Is string:', typeof slide.background === 'string');
              console.log('  - Not null:', slide.background !== null);
            }
            
            if (slide.type === 'image') {
              console.log('Image validation for image slide:');
              console.log('  - Has imageUrl:', !!slide.imageUrl);
              console.log('  - ImageUrl value:', JSON.stringify(slide.imageUrl));
              console.log('  - Is string:', typeof slide.imageUrl === 'string');
            }
          });
          
          setSlides(activeSlides);
        } else {
          console.log('No slides found, using default');
          setSlides(defaultSlides);
        }
      } else {
        console.log('Failed to fetch slides, using default');
        setSlides(defaultSlides);
      }
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      setSlides(defaultSlides);
    } finally {
      setIsLoading(false);
    }
  };



  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gray-200 animate-pulse">
        <div className="text-center">
          <div className="h-12 bg-gray-300 rounded w-96 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-80"></div>
        </div>
      </section>
    );
  }

  const currentSlideData = slides[currentSlide] || defaultSlides[0];
  console.log('Current slide data:', currentSlideData);
  console.log('Background value:', currentSlideData.background);
  console.log('Type:', currentSlideData.type);

  return (
    <section 
      className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={(() => {
          console.log('=== BACKGROUND STYLE CALCULATION ===');
          console.log('Current slide data:', currentSlideData);
          console.log('Slide type:', currentSlideData?.type);
          console.log('Background value:', currentSlideData?.background);
          console.log('ImageURL value:', currentSlideData?.imageUrl);
          
          // Separate background properties to avoid shorthand/longhand conflicts
          let style = {
            boxShadow: 'inset 0 -4px 20px rgba(212, 175, 55, 0.15)',
            width: '100%',
            height: '100%'
          };

          // Handle different background types
          if (currentSlideData?.type === 'image' && currentSlideData?.imageUrl) {
            console.log('=== IMAGE BACKGROUND PROCESSING ===');
            console.log('Image URL:', currentSlideData.imageUrl);
            console.log('URL type:', typeof currentSlideData.imageUrl);
            console.log('URL length:', currentSlideData.imageUrl?.length);
            console.log('URL starts with http:', currentSlideData.imageUrl?.startsWith('http'));
            
            // Test if it's a valid URL
            try {
              new URL(currentSlideData.imageUrl);
              console.log('✅ Valid URL format');
            } catch (e) {
              console.log('❌ Invalid URL format:', e.message);
            }
            
            const imageBackground = `linear-gradient(rgba(33, 73, 41, 0.6), rgba(33, 73, 41, 0.6)), url("${currentSlideData.imageUrl}")`;
            console.log('Constructed background:', imageBackground);
            
            style.backgroundImage = imageBackground;
            style.backgroundSize = 'cover';
            style.backgroundPosition = 'center';
            style.backgroundRepeat = 'no-repeat';
            
            // Add fallback for failed image loads
            style.backgroundColor = '#214929';
            
            console.log('✅ IMAGE STYLE APPLIED:', {
              backgroundImage: style.backgroundImage,
              backgroundSize: style.backgroundSize,
              backgroundPosition: style.backgroundPosition,
              backgroundRepeat: style.backgroundRepeat
            });
          } else if (currentSlideData?.type === 'color') {
            console.log('=== COLOR BACKGROUND PROCESSING ===');
            const backgroundValue = currentSlideData?.background;
            console.log('Raw background from data:', backgroundValue);
            
            if (!backgroundValue || backgroundValue === 'null' || backgroundValue === null || backgroundValue === undefined) {
              const fallback = 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)';
              console.log('❌ Background is null/empty, using fallback:', fallback);
              style.backgroundImage = fallback;
            } else {
              console.log('✅ Using color background:', backgroundValue);
              if (backgroundValue.includes('gradient')) {
                style.backgroundImage = backgroundValue;
              } else {
                style.backgroundColor = backgroundValue;
              }
            }
            console.log('✅ COLOR STYLE APPLIED');
          } else {
            // Default fallback
            console.log('=== DEFAULT FALLBACK ===');
            style.backgroundImage = 'linear-gradient(135deg, #214929 0%, #2a5f35 50%, #214929 100%)';
            console.log('✅ DEFAULT STYLE APPLIED');
          }
          
          console.log('Final calculated style:', style);
          console.log('=================================');
          
          return style;
        })()}
      />

      {/* Overlay for better text readability - only for image backgrounds */}
      {currentSlideData?.type === 'image' && currentSlideData?.imageUrl && (
        <div className="absolute inset-0 bg-black bg-opacity-10" />
      )}

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 max-w-4xl">
        <div 
          className={`transition-all duration-500 ease-out transform ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h1
            className="text-4xl md:text-6xl font-bold mb-6 pb-2"
            style={{ 
              fontFamily: 'var(--font-playfair), serif', 
              textShadow: '0 6px 9px rgba(4, 49, 31, 0.65), 0 2px 4px rgba(212, 175, 55, 0.3)',
              background: 'linear-gradient(to bottom, #ffffff 0%, #F4E4C1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: '1.2'
            }}
          >
            {currentSlideData.title}
          </h1>
          <p 
            className="text-base md:text-lg mb-8" 
            style={{ 
              fontFamily: 'var(--font-poppins), sans-serif', 
              fontWeight: 500, 
              color: '#F4E4C1', 
              textShadow: '0 2px 4px rgba(0,0,0,0.3)' 
            }}
          >
            {currentSlideData.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{ 
                  backgroundColor: '#D4AF37', 
                  color: '#214929',
                  fontFamily: 'var(--font-poppins), sans-serif'
                }}
              >
                Lihat Menu
              </Button>
            </Link>
            <Link href="/pesan">
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'var(--font-poppins), sans-serif' }}
              >
                Pesan Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlideManual}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}