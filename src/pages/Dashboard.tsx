
import { useEffect } from "react";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  // Certificar que o usuário está autenticado
  useAutoRedirect(undefined, "/auth");
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Dashboard | CRIEConnect";
  }, []);

  // Redirecionar para a página de links (página principal do dashboard)
  return <Navigate to="/dashboard/links" replace />;
};

export default Dashboard;
