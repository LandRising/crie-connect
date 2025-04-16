
import { useEffect } from "react";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardProfile = () => {
  const isMobile = useIsMobile();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Perfil | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        title="Meu Perfil" 
        description="Gerencie suas informações pessoais"
      />
      <ProfileAndAppearance 
        activeTab="profile-info" 
        defaultPreviewVisible={!isMobile}
      />
    </div>
  );
};

export default DashboardProfile;
