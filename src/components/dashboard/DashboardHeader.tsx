
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import InstallPWA from "@/components/pwa/InstallPWA";
import { useIsMobile } from "@/hooks/use-mobile";

type DashboardHeaderProps = {
  username: string;
};

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const isMobile = useIsMobile();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
      <h1 className="text-2xl font-bold">CRIEConnect</h1>
      <div className="flex flex-wrap gap-2">
        <InstallPWA />
        
        <Button 
          variant="outline" 
          onClick={() => navigate(`/${username}`)}
          className="flex-grow md:flex-grow-0"
        >
          Visualizar página
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="flex-grow md:flex-grow-0"
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
