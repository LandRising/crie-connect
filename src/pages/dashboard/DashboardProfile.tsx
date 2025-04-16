
import { useEffect } from "react";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardProfile = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Perfil | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Meu Perfil" 
        description="Gerencie suas informações pessoais"
      />
      <ProfileAndAppearance activeTab="profile-info" />
    </div>
  );
};

export default DashboardProfile;
