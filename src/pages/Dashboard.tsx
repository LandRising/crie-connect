
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

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { username } = useProfile();
  const { appearanceSettings, saveAppearanceSettings } = useAppearanceSettings();
  const [activeTab, setActiveTab] = useState("links");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      <DashboardHeader username={username} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="space-y-6">
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
  );
};

export default Dashboard;
