
import { useEffect } from "react";
import DashboardAnalyticsComponent from "@/components/analytics/DashboardAnalytics";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardAnalytics = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Analytics | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        title="Analytics" 
        description="Estatísticas e dados sobre seus visitantes"
      />
      <DashboardAnalyticsComponent />
    </div>
  );
};

export default DashboardAnalytics;
