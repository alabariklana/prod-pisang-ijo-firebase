/**
 * Image Optimizer Utility
 * Mengoptimalkan URL gambar dari berbagai sumber untuk performa lebih baik
 */

export function optimizeImageUrl(url, options = {}) {
  if (!url) return url;

  const {
    width = 1200,
    quality = 80,
    format = 'auto'
  } = options;

  try {
    // Google Cloud Storage
    if (url.includes('storage.googleapis.com')) {
      // GCS tidak support automatic transform, tapi bisa pakai Cloud CDN
      // Untuk sekarang return as-is, bisa tambah transform di bucket config
      return url;
    }

    // Unsplash
    if (url.includes('unsplash.com') || url.includes('images.unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}auto=format&fit=max&w=${width}&q=${quality}`;
    }

    // Pexels
    if (url.includes('pexels.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}auto=compress&cs=tinysrgb&w=${width}`;
    }

    // Imgur - use large thumbnail (l) or medium (m)
    if (url.includes('imgur.com') && !url.match(/[lmts]\.jpg$/i)) {
      // Replace extension with thumbnail version
      return url.replace(/\.(jpg|png|gif)$/i, 'l.$1');
    }

    // Cloudinary
    if (url.includes('cloudinary.com')) {
      // Insert transformation params
      return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
    }

    // Default: return original URL
    return url;
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
}

/**
 * Get optimal image dimensions based on content width
 */
export function getOptimalImageSize(containerWidth) {
  // Use device pixel ratio for retina displays
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  
  // Common breakpoints
  if (containerWidth <= 640) return Math.min(640 * dpr, 1200); // Mobile
  if (containerWidth <= 768) return Math.min(768 * dpr, 1200); // Tablet
  if (containerWidth <= 1024) return Math.min(1024 * dpr, 1200); // Desktop
  
  return 1200; // Max width for blog content
}

/**
 * Create srcset for responsive images
 */
export function createSrcSet(url, sizes = [640, 768, 1024, 1200]) {
  return sizes
    .map(size => {
      const optimized = optimizeImageUrl(url, { width: size, quality: 80 });
      return `${optimized} ${size}w`;
    })
    .join(', ');
}

/**
 * Compress quality based on image size
 */
export function getOptimalQuality(fileSize) {
  // fileSize in KB
  if (fileSize < 100) return 85; // Small images - higher quality
  if (fileSize < 500) return 80; // Medium images
  if (fileSize < 1000) return 75; // Large images
  return 70; // Very large images - more compression
}
