
import { useEffect } from "react";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardAppearance = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Aparência | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Aparência" 
        description="Personalize a aparência e o estilo da sua página"
      />
      <ProfileAndAppearance activeTab="button-style" />
    </div>
  );
};

export default DashboardAppearance;
