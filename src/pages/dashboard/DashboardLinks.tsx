
import { useEffect } from "react";
import LinksManager from "@/components/dashboard/LinksManager";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";

const DashboardLinks = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Links | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6 pb-20">
      <DashboardHeader 
        title="Meus Links" 
        description="Gerencie os links da sua página"
      />
      <Card>
        <CardContent className="px-2 py-6 sm:px-6">
          <LinksManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardLinks;
