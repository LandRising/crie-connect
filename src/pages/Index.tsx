
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">LinkSplash</h1>
        <p className="text-xl text-gray-600 mb-8">
          Uma forma simples de compartilhar todos os seus links em um só lugar.
        </p>
        
        {isLoading ? (
          <p>Carregando...</p>
        ) : user ? (
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full" size="lg">
                Ir para o Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link to="/auth">
              <Button className="w-full" size="lg">
                Começar agora
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-20 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">1. Crie uma conta</div>
            <p className="text-gray-500">
              Registre-se rapidamente com seu email e senha.
            </p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">2. Adicione seus links</div>
            <p className="text-gray-500">
              Adicione todos os links que você deseja compartilhar.
            </p>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">3. Compartilhe</div>
            <p className="text-gray-500">
              Compartilhe sua página personalizada com todos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
