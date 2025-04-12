
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

type DashboardHeaderProps = {
  username: string;
};

const DashboardHeader = ({ username }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">CRIEConnect</h1>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(`/${username}`)}>
          Visualizar página
        </Button>
        <Button variant="outline" onClick={handleSignOut}>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
