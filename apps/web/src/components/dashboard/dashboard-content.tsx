'use client';

import { Suspense, useState, useEffect } from 'react';
import { DashboardOverview } from './dashboard-overview';
import { RecentEvents } from './recent-events';
import { QuickStats } from './quick-stats';
import { DashboardSkeleton } from './dashboard-skeleton';

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Show skeleton for 800ms

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <QuickStats />
      <DashboardOverview />
      <RecentEvents />
    </div>
  );
} 