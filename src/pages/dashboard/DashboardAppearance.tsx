
import { useEffect } from "react";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from '@/hooks/use-mobile';

const DashboardAppearance = () => {
  const isMobile = useIsMobile();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Aparência | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        title="Aparência" 
        description="Personalize a aparência e o estilo da sua página"
      />
      <ProfileAndAppearance 
        activeTab="button-style" 
        defaultPreviewVisible={!isMobile}
      />
    </div>
  );
};

export default DashboardAppearance;
