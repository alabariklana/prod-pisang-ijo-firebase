// Lazy load utilities untuk component yang berat
export const lazyLoadComponent = (importFunc, options = {}) => {
  return dynamic(importFunc, {
    loading: () => options.fallback || <div className="animate-pulse bg-gray-200 h-20 rounded"></div>,
    ssr: options.ssr !== false,
  });
};

export const preloadComponent = (importFunc) => {
  importFunc();
};
