
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, ChevronRight, LayoutDashboard, Link as LinkIcon, 
  Palette, BarChart3, Settings, User, LogOut 
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon: Icon, label, href, active, collapsed, onClick }: NavItemProps) => {
  return (
    <Link 
      to={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon size={20} className={cn("flex-shrink-0", active ? "text-primary" : "")} />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { username } = useProfile();
  const [activeTab, setActiveTab] = useState<string>(
    location.pathname === "/dashboard" ? "links" : location.pathname.split('/').pop() || "links"
  );

  const isActive = (path: string) => {
    if (path === "links" && location.pathname === "/dashboard") return true;
    return location.pathname.includes(path);
  };

  return (
    <div 
      className={cn(
        "flex flex-col border-r bg-card h-screen-safe transition-all duration-300 sticky top-0 z-30",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between h-14 border-b px-3 py-2">
        {!collapsed && (
          <Link to="/" className="text-xl font-bold flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-7 h-7 flex items-center justify-center rounded text-sm">C</span>
            <span>CRIE</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <span className="bg-primary text-primary-foreground w-9 h-9 flex items-center justify-center rounded text-sm">C</span>
          </Link>
        )}
        <Button 
          onClick={onToggle} 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto", collapsed ? "rotate-180" : "")}
        >
          <ChevronLeft size={18} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1.5">
          <NavItem 
            icon={LayoutDashboard} 
            label="Dashboard"
            href="/dashboard" 
            active={activeTab === "links"} 
            collapsed={collapsed}
            onClick={() => setActiveTab("links")}
          />
          <NavItem 
            icon={LinkIcon} 
            label="Links" 
            href="/dashboard/links" 
            active={isActive("links")}
            collapsed={collapsed}
            onClick={() => setActiveTab("links")}
          />
          <NavItem 
            icon={Palette} 
            label="Aparência" 
            href="/dashboard/appearance" 
            active={isActive("appearance")}
            collapsed={collapsed}
            onClick={() => setActiveTab("appearance")}
          />
          <NavItem 
            icon={BarChart3} 
            label="Analytics" 
            href="/dashboard/analytics" 
            active={isActive("analytics")}
            collapsed={collapsed}
            onClick={() => setActiveTab("analytics")}
          />
          <NavItem 
            icon={User} 
            label="Perfil" 
            href="/dashboard/profile" 
            active={isActive("profile")}
            collapsed={collapsed}
            onClick={() => setActiveTab("profile")}
          />
          <NavItem 
            icon={Settings} 
            label="Configurações" 
            href="/dashboard/settings" 
            active={isActive("settings")}
            collapsed={collapsed}
            onClick={() => setActiveTab("settings")}
          />
        </nav>
      </ScrollArea>

      <div className={cn(
        "border-t p-4",
        collapsed ? "items-center justify-center" : ""
      )}>
        {!collapsed && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <User size={18} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">@{username}</span>
                <Link to={`/${username}`} className="text-xs text-blue-500 hover:underline">
                  Ver página
                </Link>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="mt-2 justify-start">
              <LogOut size={16} className="mr-2" /> Sair
            </Button>
          </div>
        )}

        {collapsed && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User size={16} className="text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LogOut size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
