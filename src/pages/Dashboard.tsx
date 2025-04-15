
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LinksManager from "@/components/dashboard/LinksManager";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import InstallPWA from "@/components/pwa/InstallPWA";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import DashboardAnalytics from "@/components/analytics/DashboardAnalytics";
import { BarChart3, Link, Palette, User } from "lucide-react";

const Dashboard = () => {
  // Certificar que o usuário está autenticado
  useAutoRedirect(undefined, "/auth");
  
  const { username } = useProfile();
  const { appearanceSettings, saveAppearanceSettings } = useAppearanceSettings();
  const [activeTab, setActiveTab] = useState("links");
  const isMobile = useIsMobile();

  // Definir o título da página
  useEffect(() => {
    document.title = "Dashboard | Crie Connect";
  }, []);

  return (
    <div className="min-h-screen-safe bg-background p-3 sm:p-4 w-full">
      <div className="max-w-2xl mx-auto">
        <DashboardHeader username={username} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="links" className="flex-shrink-0 flex items-center gap-2">
              <Link size={16} /> Links
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-shrink-0 flex items-center gap-2">
              <User size={16} /> Perfil e Aparência
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-shrink-0 flex items-center gap-2">
              <BarChart3 size={16} /> Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-4 sm:space-y-6">
            <LinksManager />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileAndAppearance />
          </TabsContent>
          
          <TabsContent value="analytics">
            <DashboardAnalytics />
          </TabsContent>
        </Tabs>
        
        {/* Botão de instalação PWA apenas para usuários autenticados */}
        <div className="fixed bottom-6 right-6 z-50">
          <InstallPWA />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
