import { useState } from 'react';
import { DashboardNav } from './dashboard-nav';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResizableSidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export function ResizableSidebar({ onCollapse }: ResizableSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse?.(!isCollapsed);
  };

  return (
    <aside 
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors z-10"
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-gray-600" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        )}
      </button>
      
      {/* Navigation - always visible, handles collapsed state internally */}
      <DashboardNav isCollapsed={isCollapsed} />
    </aside>
  );
}