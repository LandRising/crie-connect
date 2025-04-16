
import { useEffect } from "react";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import { Navigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  
  // Certificar que o usuário está autenticado
  useAutoRedirect(undefined, "/auth");
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Dashboard | CRIEConnect";
  }, []);

  // Quando o usuário visita /dashboard, encaminhamos para a página de links
  // Mas mantemos o state da navegação para preservar a capacidade de "voltar"
  return (
    <Navigate 
      to="/dashboard/links" 
      replace 
      state={{ from: location }}
    />
  );
};

export default Dashboard;
