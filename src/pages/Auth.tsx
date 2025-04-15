
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Lock, AlertTriangle, User, Check } from "lucide-react";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "reset">("login");
  const [resetSent, setResetSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);
  const navigate = useNavigate();
  
  // Redirecionar se já estiver autenticado
  useAutoRedirect("/dashboard");

  // Validar força da senha
  useEffect(() => {
    if (!password) {
      setPasswordStrength(null);
      return;
    }
    
    const hasLetters = /[a-z]/i.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (hasLetters && hasNumbers && hasSpecial && password.length >= 8) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  }, [password]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: "Conta criada com sucesso",
          description: "Você já pode fazer login com suas credenciais.",
        });
        setActiveTab("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, insira seu email para recuperar a senha",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?tab=update-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique seu email para instruções de recuperação de senha",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao recuperar senha",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
      // Redirecionamento é gerenciado pelo Supabase
    } catch (error: any) {
      toast({
        title: "Erro ao autenticar com Google",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  const getPasswordFeedback = () => {
    switch (passwordStrength) {
      case "weak": return (
        <div className="flex items-center text-xs text-red-500 mt-1 gap-1">
          <AlertTriangle size={12} />
          <span>Senha fraca - use pelo menos 6 caracteres</span>
        </div>
      );
      case "medium": return (
        <div className="flex items-center text-xs text-yellow-500 mt-1 gap-1">
          <AlertTriangle size={12} />
          <span>Senha média - adicione caracteres especiais</span>
        </div>
      );
      case "strong": return (
        <div className="flex items-center text-xs text-green-500 mt-1 gap-1">
          <Check size={12} />
          <span>Senha forte</span>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen-safe bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            {activeTab === "login" 
              ? "Entrar na sua conta" 
              : activeTab === "signup" 
                ? "Criar uma conta" 
                : "Recuperar senha"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as "login" | "signup" | "reset")}
            className="mb-4"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Cadastro</TabsTrigger>
              <TabsTrigger value="reset">Recuperar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="pl-9 w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="********"
                      className="pl-9 w-full"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                
                <div className="relative my-4">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">
                      ou continue com
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-4 w-4">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="seu@email.com"
                      className="pl-9 w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="********"
                      className="pl-9 w-full"
                      minLength={6}
                    />
                  </div>
                  
                  {/* Indicador de força da senha */}
                  {password && (
                    <>
                      <div className="h-1 w-full bg-gray-200 rounded-full mt-2">
                        <div className={`h-1 rounded-full ${getPasswordStrengthColor()}`} style={{
                          width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%"
                        }} />
                      </div>
                      {getPasswordFeedback()}
                    </>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
                
                <div className="relative my-4">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-xs text-muted-foreground">
                      ou continue com
                    </span>
                  </div>
                </div>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-4 w-4">
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                  </svg>
                  Google
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="reset">
              {resetSent ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">Email enviado!</h3>
                  <p className="text-muted-foreground mb-4">
                    Verifique sua caixa de entrada para instruções de recuperação de senha.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setResetSent(false);
                      setActiveTab("login");
                    }}
                  >
                    Voltar para o login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="reset-email" className="text-sm font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="reset-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="seu@email.com"
                        className="pl-9 w-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enviaremos instruções para redefinir sua senha.
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar instruções"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="link" size="sm" className="text-xs">
                Precisa de ajuda?
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Suporte</SheetTitle>
                <SheetDescription>
                  Como podemos ajudar você com o acesso à sua conta?
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Não consigo fazer login</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifique se você está usando o email correto e se digitou a senha corretamente. Caso não lembre sua senha, use a opção "Recuperar" para redefiní-la.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Não recebi o email de recuperação</h3>
                  <p className="text-sm text-muted-foreground">
                    Verifique sua pasta de spam ou lixo eletrônico. O email pode levar alguns minutos para chegar.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Problemas com login via Google</h3>
                  <p className="text-sm text-muted-foreground">
                    Certifique-se de permitir os pop-ups no seu navegador e tente novamente.
                  </p>
                </div>
                <div className="space-y-2 mt-6">
                  <p className="text-sm text-muted-foreground">
                    Para outras dúvidas, entre em contato com o suporte pelo email:
                    <a href="mailto:suporte@exemplo.com" className="text-primary ml-1">suporte@exemplo.com</a>
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
