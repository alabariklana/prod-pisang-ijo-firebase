'use client';

import { useEffect, useState, useRef } from 'react';

export default function FacebookComments({ url, width = '100%', numPosts = 10 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer untuk lazy load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !sdkLoaded) {
          setIsVisible(true);
        }
      },
      { rootMargin: '100px' } // Load 100px sebelum terlihat
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [sdkLoaded]);

  useEffect(() => {
    if (!isVisible || sdkLoaded) return;

    // Log untuk debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Facebook App ID:', process.env.NEXT_PUBLIC_FACEBOOK_APP_ID);
      console.log('Comment URL:', url);
    }
    
    // Load Facebook SDK
    if (typeof window !== 'undefined' && !window.FB) {
      window.fbAsyncInit = function() {
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '1479350106689786';
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Initializing Facebook SDK with App ID:', appId);
        }
        
        window.FB.init({
          appId: appId,
          xfbml: true,
          version: 'v21.0'
        });
        
        setSdkLoaded(true);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Facebook SDK initialized');
        }
        
        // Parse Facebook comments after SDK loads
        if (window.FB) {
          window.FB.XFBML.parse();
        }
      };

      // Load the SDK asynchronously
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/id_ID/sdk.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else if (window.FB) {
      // SDK already loaded, just parse
      setSdkLoaded(true);
      if (process.env.NODE_ENV === 'development') {
        console.log('Facebook SDK already loaded, re-parsing...');
      }
      window.FB.XFBML.parse();
    }
  }, [isVisible, sdkLoaded]);

  // Re-parse when URL changes
  useEffect(() => {
    if (sdkLoaded && window.FB) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Re-parsing Facebook comments for URL:', url);
      }
      window.FB.XFBML.parse();
    }
  }, [url, sdkLoaded]);

  return (
    <div ref={containerRef} className="fb-comments-wrapper">
      <div id="fb-root"></div>
      {isVisible && (
        <div
          className="fb-comments"
          data-href={url}
          data-width={width}
          data-numposts={numPosts}
          data-colorscheme="light"
        ></div>
      )}
      {!isVisible && (
        <div className="animate-pulse bg-gray-200 rounded-lg p-8 text-center text-gray-500">
          Loading comments...
        </div>
      )}
    </div>
  );
}
