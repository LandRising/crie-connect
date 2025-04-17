
import { useEffect } from "react";
import DashboardAnalyticsComponent from "@/components/analytics/DashboardAnalytics";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const DashboardAnalytics = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Analytics Dashboard | CRIEConnect";
  }, []);
  
  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <DashboardHeader 
        title="Analytics Dashboard" 
        description="Comprehensive insights and performance metrics for your page"
      />
      <DashboardAnalyticsComponent />
    </div>
  );
};

export default DashboardAnalytics;
