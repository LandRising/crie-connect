
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LinksManager from "@/components/dashboard/LinksManager";
import ProfileEditor from "@/components/ProfileEditor";
import AppearanceSettings from "@/components/AppearanceSettings";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { useProfile } from "@/hooks/useProfile";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { username } = useProfile();
  const { appearanceSettings, saveAppearanceSettings } = useAppearanceSettings();
  const [activeTab, setActiveTab] = useState("links");
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen-safe bg-background p-3 sm:p-4 w-full">
      <div className="max-w-2xl mx-auto">
        <DashboardHeader username={username} />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto no-scrollbar">
            <TabsTrigger value="links" className="flex-shrink-0">Links</TabsTrigger>
            <TabsTrigger value="profile" className="flex-shrink-0">Perfil</TabsTrigger>
            <TabsTrigger value="appearance" className="flex-shrink-0">Aparência</TabsTrigger>
          </TabsList>
          
          <TabsContent value="links" className="space-y-4 sm:space-y-6">
            <LinksManager />
          </TabsContent>
          
          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>
          
          <TabsContent value="appearance">
            <AppearanceSettings 
              initialSettings={appearanceSettings || undefined} 
              onSave={saveAppearanceSettings} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
