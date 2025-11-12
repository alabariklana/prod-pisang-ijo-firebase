import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export function StockStatus({ stock, lowStockThreshold = 5, size = 'default', showIcon = true, showText = true }) {
  const getStatusInfo = () => {
    if (stock === 0) {
      return {
        status: 'out_of_stock',
        label: 'Habis',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (stock <= lowStockThreshold) {
      return {
        status: 'low_stock',
        label: 'Hampir Habis',
        icon: AlertTriangle,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        status: 'in_stock',
        label: 'Tersedia',
        icon: CheckCircle,
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${statusInfo.className} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {showText && statusInfo.label}
    </span>
  );
}

export function StockQuantity({ stock, lowStockThreshold = 5, showStatus = true }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-sm">
        {stock} unit{stock !== 1 ? 's' : ''}
      </span>
      {showStatus && (
        <StockStatus 
          stock={stock} 
          lowStockThreshold={lowStockThreshold} 
          size="sm" 
          showIcon={false}
        />
      )}
    </div>
  );
}

export function StockIndicator({ stock, lowStockThreshold = 5, className = "" }) {
  const getColorClass = () => {
    if (stock === 0) return 'bg-red-500';
    if (stock <= lowStockThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getColorClass()} ${className}`} 
         title={`Stock: ${stock} units`} 
    />
  );
}