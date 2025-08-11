import { Suspense } from 'react';
import { RsvpAnalytics } from '@/components/analytics/rsvp-analytics';
import { AnalyticsHeader } from '@/components/analytics/analytics-header';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <AnalyticsHeader />
      
      <Suspense fallback={<div>Loading analytics...</div>}>
        <RsvpAnalytics />
      </Suspense>
    </div>
  );
} 