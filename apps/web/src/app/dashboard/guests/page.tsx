import { Suspense } from 'react';
import { GuestsList } from '@/components/guests/guests-list';
import { GuestsHeader } from '@/components/guests/guests-header';

export default function GuestsPage() {
  return (
    <div className="space-y-6">
      <GuestsHeader />
      
      <Suspense fallback={<div>Loading guests...</div>}>
        <GuestsList />
      </Suspense>
    </div>
  );
} 