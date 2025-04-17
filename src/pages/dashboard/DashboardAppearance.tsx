
import { useEffect } from "react";
import ProfileAndAppearance from "@/components/profile/editor/ProfileAndAppearance";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from "@/components/ui/card";

const DashboardAppearance = () => {
  const isMobile = useIsMobile();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Aparência | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6 pb-20">
      <DashboardHeader 
        title="Aparência" 
        description="Personalize a aparência e o estilo da sua página"
      />
      <Card>
        <CardContent className="px-2 py-6 sm:px-6">
          <ProfileAndAppearance 
            activeTab="button-style" 
            defaultPreviewVisible={!isMobile}
            isCompact={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardAppearance;
