/**
 * Image URL utilities for handling both local and GCP storage
 */

/**
 * Get the correct image URL for display
 * @param {string} imagePath - The image path (can be local path like /uploads/... or GCS URL)
 * @param {string} type - Type of image ('product' or 'profile')
 * @returns {string} - The final URL for the image
 */
export function getImageUrl(imagePath, type = 'product') {
  if (!imagePath) return null;
  
  // If it's already a full URL (GCS or other), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path (/uploads/...), check if we should proxy it
  if (imagePath.startsWith('/uploads/')) {
    const useGcs = process.env.NEXT_PUBLIC_USE_GCS === 'true';
    
    if (useGcs) {
      // Convert local path to GCS proxy path
      const pathWithoutUploads = imagePath.replace('/uploads/', '');
      return `/api/images/${pathWithoutUploads}`;
    } else {
      // Return local path as is
      return imagePath;
    }
  }
  
  // If it's just a filename, construct the appropriate path
  if (!imagePath.includes('/')) {
    const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || 'pisang-ijo-assets';
    let folder = 'products'; // default
    
    if (type === 'profile') folder = 'profiles';
    else if (type === 'blog') folder = 'blog';
    else if (type === 'product') folder = 'products';
    
    const useGcs = process.env.NEXT_PUBLIC_USE_GCS === 'true';
    
    if (useGcs) {
      // Use proxy route for GCS images
      return `/api/images/${folder}/${imagePath}`;
    } else {
      // Use local path
      return `/uploads/${folder}/${imagePath}`;
    }
  }
  
  // Fallback: return as is
  return imagePath;
}

/**
 * Get direct GCS URL (for administrative purposes)
 * @param {string} imagePath - The image path
 * @param {string} type - Type of image ('product' or 'profile')
 * @returns {string} - Direct GCS URL
 */
export function getDirectGcsUrl(imagePath, type = 'product') {
  if (!imagePath) return null;
  
  // If it's already a GCS URL, return as is
  if (imagePath.includes('storage.googleapis.com')) {
    return imagePath;
  }
  
  const bucketName = process.env.NEXT_PUBLIC_GCS_BUCKET_NAME || 'pisang-ijo-assets';
  let folder = 'products'; // default
  
  if (type === 'profile') folder = 'profiles';
  else if (type === 'blog') folder = 'blog';
  else if (type === 'product') folder = 'products';
  
  // Extract filename from path
  const filename = imagePath.includes('/') 
    ? imagePath.split('/').pop() 
    : imagePath;
  
  return `https://storage.googleapis.com/${bucketName}/${folder}/${filename}`;
}

/**
 * Convert legacy local URLs to new format
 * @param {string} url - Old URL format
 * @returns {string} - New URL format
 */
export function migrateLegacyImageUrl(url) {
  if (!url) return null;
  
  // Convert old biolink_pisjo URLs to new bucket
  if (url.includes('storage.googleapis.com/biolink_pisjo/')) {
    return url.replace('biolink_pisjo', 'pisang-ijo-assets');
  }
  
  return getImageUrl(url);
}