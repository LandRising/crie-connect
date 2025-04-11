
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
      <p className="text-gray-500 mb-6">
        A página que você está procurando não existe.
      </p>
      <Link to="/">
        <Button>Voltar para a página inicial</Button>
      </Link>
    </div>
  );
};

export default NotFound;
