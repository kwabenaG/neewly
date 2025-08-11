'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Calendar,
  FileText
} from 'lucide-react';
import { CreateEventDialog } from '@/components/events/create-event-dialog';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Guests', href: '/dashboard/guests', icon: Users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface DashboardNavProps {
  isCollapsed?: boolean;
}

export function DashboardNav({ isCollapsed = false }: DashboardNavProps) {
  const pathname = usePathname();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      {/* <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Newly
        </span>
      </div> */}

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-3", isCollapsed ? "p-2" : "p-6")}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={cn(
                'flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3',
                isActive
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Create Event Button */}
      <div className={cn("border-t border-gray-200", isCollapsed ? "p-2" : "p-6")}>
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          title={isCollapsed ? "Create Event" : undefined}
          className={cn(
            "flex items-center justify-center w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105",
            isCollapsed ? "p-3" : "space-x-2 px-4 py-3"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && <span>Create Event</span>}
        </button>
      </div>

      {/* Create Event Dialog */}
      <CreateEventDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
} 