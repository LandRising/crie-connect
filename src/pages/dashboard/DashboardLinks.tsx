
import { useEffect } from "react";
import LinksManager from "@/components/dashboard/LinksManager";

const DashboardLinks = () => {
  // Definir o título da página
  useEffect(() => {
    document.title = "Links | CRIEConnect";
  }, []);
  
  return <LinksManager />;
};

export default DashboardLinks;
