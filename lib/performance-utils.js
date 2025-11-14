/**
 * @fileoverview Performance optimization utilities
 * Lazy loading components and performance improvements
 * @author Pisang Ijo Evi
 */

import { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Lazy load component with loading fallback
 * @param {Function} importFn - Dynamic import function
 * @param {JSX.Element} fallback - Loading fallback component
 * @returns {JSX.Element} Lazy loaded component with Suspense
 */
export function lazyLoadWithSuspense(importFn, fallback = <ComponentSkeleton />) {
  const LazyComponent = lazy(importFn);
  
  return function LazyComponentWithSuspense(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Generic component skeleton for loading states
 * @param {Object} props - Component props
 * @param {number} props.rows - Number of skeleton rows
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element}
 */
export function ComponentSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

/**
 * Dashboard card skeleton
 * @returns {JSX.Element}
 */
export function DashboardCardSkeleton() {
  return (
    <div className="p-6 border rounded-lg">
      <Skeleton className="h-6 w-1/3 mb-2" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

/**
 * Table skeleton for data tables
 * @param {Object} props - Component props  
 * @param {number} props.rows - Number of table rows
 * @param {number} props.columns - Number of table columns
 * @returns {JSX.Element}
 */
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-8 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: columns }, (_, j) => (
            <Skeleton key={j} className="h-12 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Debounce function for search and input optimization
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Throttle function for scroll and resize events
 * @param {Function} func - Function to throttle  
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let isThrottled = false;
  
  return function throttled(...args) {
    if (!isThrottled) {
      func.apply(this, args);
      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  };
}

/**
 * Intersection Observer hook for lazy loading
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isIntersecting, entry];
}

/**
 * Image lazy loading component with intersection observer
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text
 * @param {string} props.className - CSS classes
 * @param {string} props.placeholder - Placeholder image
 * @returns {JSX.Element}
 */
export function LazyImage({ src, alt, className = '', placeholder = '/placeholder.png' }) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && src) {
      setImageSrc(src);
    }
  }, [isIntersecting, src]);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImageSrc(placeholder)}
    />
  );
}