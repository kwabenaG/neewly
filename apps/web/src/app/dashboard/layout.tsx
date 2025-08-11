'use client';

import { useRouter } from 'next/navigation';
import { UserNav } from '@/components/dashboard/user-nav';
import { ResizableSidebar } from '@/components/dashboard/resizable-sidebar';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  console.log('[DashboardLayout] Auth state:', { userId, isLoaded });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      console.log('[DashboardLayout] No user ID, redirecting to login');
      router.push('/login');
    }
  }, [isLoaded, userId, router]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    console.log('[DashboardLayout] Clerk not loaded yet, showing spinner');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!userId) {
    console.log('[DashboardLayout] No user ID, not rendering');
    return null;
  }

  console.log('[DashboardLayout] Rendering dashboard for user:', userId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex h-16 items-center justify-between px-6 sm:px-8 lg:px-10">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Newly</span>
            </div>
          </div>
          
          <UserNav />
        </div>
      </header>

      <div className="flex pt-16"> {/* Add padding-top to account for fixed header */}
        {/* Sidebar */}
        <ResizableSidebar onCollapse={setIsSidebarCollapsed} />

        {/* Main content */}
        <main 
          className={cn(
            "flex-1 p-8 min-h-[calc(100vh-4rem)] transition-all duration-300",
            isSidebarCollapsed ? "ml-16" : "ml-64"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
} 