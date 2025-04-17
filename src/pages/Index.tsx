
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { ArrowRight, CheckCircle, Command, Globe, MousePointer, Share2, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { user, isLoading } = useAuth();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Crie Connect - Compartilhe seus links em um só lugar";
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 overflow-hidden">
      {/* Hero Section */}
      <header className="relative pt-16 md:pt-24 pb-10 px-4">
        <motion.div 
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center space-y-4 md:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Crie Connect
            </h1>
            
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-muted-foreground">
              A forma mais elegante de compartilhar todos os seus links em um único lugar.
              <span className="hidden md:inline"> Personalize, acompanhe e cresça.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 md:pt-8">
              {isLoading ? (
                <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
              ) : user ? (
                <Link to="/dashboard" className="block">
                  <Button size="lg" className="group">
                    Acessar Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="block w-full sm:w-auto">
                    <Button variant="default" size="lg" className="w-full sm:w-auto group">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link to="/auth" className="block w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explorar recursos
                    </Button>
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground pt-4">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm">Acesso gratuito</span>
              <span className="mx-2">•</span>
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm">Fácil de usar</span>
              <span className="mx-2">•</span>
              <CheckCircle className="h-4 w-4 text-primary" />
              <span className="text-sm">Analytics detalhado</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Como funciona */}
      <section className="py-16 md:py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crie seu perfil personalizado em apenas alguns minutos e comece a compartilhar com o mundo.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <motion.div 
              className="relative p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Command size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Crie uma conta</h3>
              <p className="text-muted-foreground">
                Registre-se em segundos e comece a construir sua presença digital unificada.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <MousePointer size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Adicione seus links</h3>
              <p className="text-muted-foreground">
                Organize todos os seus links relevantes em uma interface elegante e intuitiva.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Compartilhe</h3>
              <p className="text-muted-foreground">
                Compartilhe sua página personalizada e acompanhe seu desempenho com analytics avançado.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-10 md:mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos avançados</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para criar uma presença digital profissional.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Feature 
              icon={<Sparkles size={20} />} 
              title="Personalização completa" 
              description="Ajuste cores, fontes e layout para combinar com sua marca pessoal."
            />
            <Feature 
              icon={<Globe size={20} />} 
              title="Links ilimitados" 
              description="Adicione quantos links precisar para todas as suas redes sociais e projetos."
            />
            <Feature 
              icon={<Zap size={20} />} 
              title="Analytics em tempo real" 
              description="Acompanhe visitas e cliques para otimizar sua presença online."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center rounded text-sm">C</span>
            <span className="font-bold">CRIE Connect</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CRIE Connect. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Entrar
            </Link>
            <Link to="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cadastrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature component para os recursos
const Feature = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <motion.div 
      className="p-5 rounded-xl border bg-card/40 hover:bg-card/70 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground pl-11">{description}</p>
    </motion.div>
  );
};

export default Index;
