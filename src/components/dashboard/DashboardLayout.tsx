
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import InstallPWA from "@/components/pwa/InstallPWA";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  return (
    <div className="flex h-screen-safe bg-background relative">
      {!isMobile ? (
        <Sidebar 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(!collapsed)}
        />
      ) : (
        <>
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} />
          </Button>
          
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="p-0 w-[270px] sm:max-w-[270px]">
              <Sidebar 
                collapsed={false} 
                onToggle={() => {}}
                isMobileSheet={true}
                onNavigation={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </>
      )}
      
      <main className="flex-1 flex flex-col h-screen-safe overflow-y-auto">
        <div className="flex-1 container max-w-6xl py-4 md:py-6 px-4 pt-16 md:pt-6">
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
