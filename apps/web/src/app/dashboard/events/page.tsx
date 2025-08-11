import { Suspense } from 'react';
import { EventsList } from '@/components/events/events-list';
import { EventsHeader } from '@/components/events/events-header';
import { EventsListSkeleton } from '@/components/events/events-list-skeleton';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <EventsHeader />
      
      <Suspense fallback={<EventsListSkeleton />}>
        <EventsList />
      </Suspense>
    </div>
  );
} 