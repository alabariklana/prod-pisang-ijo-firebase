/**
 * @fileoverview Lazy loaded dashboard components for better performance
 * @author Pisang Ijo Evi
 */

import { lazyLoadWithSuspense, DashboardCardSkeleton, TableSkeleton } from '@/lib/performance-utils';

// Lazy load dashboard components
export const LazyInventoryDashboard = lazyLoadWithSuspense(
  () => import('@/app/dashboard/inventory/page'),
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }, (_, i) => (
      <DashboardCardSkeleton key={i} />
    ))}
  </div>
);

export const LazyOrdersDashboard = lazyLoadWithSuspense(
  () => import('@/app/dashboard/orders/page'),
  <div className="space-y-4">
    <DashboardCardSkeleton />
    <TableSkeleton rows={8} columns={6} />
  </div>
);

export const LazyProductsDashboard = lazyLoadWithSuspense(
  () => import('@/app/dashboard/products/page'),
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }, (_, i) => (
        <DashboardCardSkeleton key={i} />
      ))}
    </div>
    <TableSkeleton rows={6} columns={5} />
  </div>
);

export const LazyMembersDashboard = lazyLoadWithSuspense(
  () => import('@/app/dashboard/members/page'),
  <div className="space-y-4">
    <DashboardCardSkeleton />
    <TableSkeleton rows={10} columns={4} />
  </div>
);

export const LazySettingsDashboard = lazyLoadWithSuspense(
  () => import('@/app/dashboard/settings/page'),
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {Array.from({ length: 4 }, (_, i) => (
      <DashboardCardSkeleton key={i} />
    ))}
  </div>
);