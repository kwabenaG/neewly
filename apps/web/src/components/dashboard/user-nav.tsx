'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function UserNav() {
  return (
    <div className="flex items-center space-x-4">
      {/* Notifications */}
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
      </Button>

      {/* Settings */}
      <Button variant="ghost" size="sm">
        <Settings className="h-5 w-5" />
      </Button>

      {/* User Profile */}
      <UserButton 
        appearance={{
          elements: {
            avatarBox: "h-8 w-8"
          }
        }}
      />
    </div>
  );
} 