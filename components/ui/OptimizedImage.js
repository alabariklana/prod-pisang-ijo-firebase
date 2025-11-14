/**
 * @fileoverview Optimized image component with lazy loading and WebP support
 * @author Pisang Ijo Evi
 */

'use client';

import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/lib/performance-utils';
import PropTypes from 'prop-types';

/**
 * Optimized image component with lazy loading, WebP support, and fallbacks
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {string} props.className - CSS classes
 * @param {string} props.sizes - Responsive image sizes
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.placeholder - Placeholder image URL
 * @param {boolean} props.lazy - Enable lazy loading
 * @param {string} props.priority - Loading priority (high, low, auto)
 * @returns {JSX.Element}
 */
export function OptimizedImage({
  src,
  alt,
  className = '',
  sizes,
  width,
  height,
  placeholder = '/images/placeholder.jpg',
  lazy = true,
  priority = 'auto',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(lazy ? placeholder : src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageRef, isIntersecting] = useIntersectionObserver();

  // Generate WebP and fallback sources
  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc || originalSrc.startsWith('data:')) return originalSrc;
    
    // If it's already a WebP or from external source, return as is
    if (originalSrc.includes('.webp') || originalSrc.startsWith('http')) {
      return originalSrc;
    }
    
    // Convert to WebP for local images
    const ext = originalSrc.split('.').pop();
    const webpSrc = originalSrc.replace(`.${ext}`, '.webp');
    
    return webpSrc;
  };

  const webpSrc = getOptimizedSrc(src);
  const fallbackSrc = src;

  useEffect(() => {
    if (!lazy) {
      setImageSrc(src);
      return;
    }

    if (isIntersecting && src) {
      // Try WebP first, fallback to original
      const img = new Image();
      img.onload = () => {
        setImageSrc(webpSrc);
        setIsLoaded(true);
      };
      img.onerror = () => {
        // WebP failed, try original format
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          setImageSrc(fallbackSrc);
          setIsLoaded(true);
        };
        fallbackImg.onerror = () => {
          setHasError(true);
          setImageSrc(placeholder);
        };
        fallbackImg.src = fallbackSrc;
      };
      img.src = webpSrc;
    }
  }, [isIntersecting, src, webpSrc, fallbackSrc, placeholder, lazy]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(placeholder);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <picture>
        {/* WebP source for modern browsers */}
        <source srcSet={webpSrc} type="image/webp" />
        
        {/* Fallback for older browsers */}
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          sizes={sizes}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : priority === 'high' ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </picture>

      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

/**
 * Product image component with optimized loading
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {string} props.size - Image size (sm, md, lg)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export function ProductImage({ product, size = 'md', className = '', ...props }) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64'
  };

  const imageSrc = product?.image || product?.imageUrl || '/images/product-placeholder.jpg';
  
  return (
    <OptimizedImage
      src={imageSrc}
      alt={product?.name || 'Product image'}
      className={`${sizeClasses[size]} object-cover rounded-lg ${className}`}
      placeholder="/images/product-placeholder.jpg"
      {...props}
    />
  );
}

// PropTypes for type checking
OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  sizes: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  placeholder: PropTypes.string,
  lazy: PropTypes.bool,
  priority: PropTypes.oneOf(['high', 'low', 'auto'])
};

ProductImage.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    imageUrl: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};