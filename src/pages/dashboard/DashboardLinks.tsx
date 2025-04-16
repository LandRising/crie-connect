
import { useEffect } from "react";
import LinksManager from "@/components/dashboard/LinksManager";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardLinks = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Links | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        title="Meus Links" 
        description="Gerencie os links da sua página"
      />
      <LinksManager />
    </div>
  );
};

export default DashboardLinks;
