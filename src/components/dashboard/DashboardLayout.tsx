
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import InstallPWA from "@/components/pwa/InstallPWA";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex h-screen-safe bg-background relative">
      <Sidebar 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
      />
      
      <main className="flex-1 flex flex-col h-screen-safe overflow-y-auto">
        <div className="flex-1 container max-w-6xl py-6 px-4">
          <Outlet />
        </div>
        
        <div className="fixed bottom-6 right-6 z-50">
          <InstallPWA />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
