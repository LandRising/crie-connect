
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const DashboardSettings = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Configurações | CRIEConnect";
  }, []);
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };
  
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Configurações" 
        description="Gerencie as configurações da sua conta"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Privacidade</CardTitle>
            <CardDescription>Gerencie suas configurações de privacidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Analytics</Label>
                <div className="text-sm text-muted-foreground">
                  Permitir coleta de dados anônimos para melhorar seu perfil
                </div>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Perfil público</Label>
                <div className="text-sm text-muted-foreground">
                  Tornar seu perfil visível para todos
                </div>
              </div>
              <Switch id="public-profile" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
            <CardDescription>Gerencie suas informações de conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <div className="text-sm">usuario@exemplo.com</div>
            </div>
            <div className="space-y-2">
              <Label>Conta criada em</Label>
              <div className="text-sm">12 de abril de 2025</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Esta opção estará disponível em breve.",
                });
              }}
            >
              Alterar Senha
            </Button>
            <Button 
              variant="destructive"
              onClick={handleSignOut}
            >
              Sair da Conta
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSettings;
