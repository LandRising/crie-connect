
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Impede que o mini-infobar apareça em mobile
      e.preventDefault();
      // Armazena o evento para que possa ser acionado mais tarde
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Atualiza UI para notificar que o app pode ser instalado
      setIsInstallable(true);
      console.log('O app pode ser instalado!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Verifica se o app já está instalado
    const checkAppInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        setIsInstalled(true);
        setIsInstallable(false);
        console.log('A aplicação já está instalada');
      }
    };
    
    checkAppInstalled();
    
    // Monitorar quando o app for instalado
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast.success('CRIE Connect foi instalado com sucesso!');
      console.log('PWA instalado com sucesso!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Se não tiver o evento armazenado, mostra instruções alternativas
      toast.info('Instale nosso app através do menu do seu navegador');
      return;
    }

    // Mostra o prompt de instalação
    await deferredPrompt.prompt();

    // Aguarda o usuário responder ao prompt
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do PWA');
      toast.success('Instalação iniciada!');
    } else {
      console.log('Usuário recusou a instalação do PWA');
      toast.info('Você pode instalar o app mais tarde pelo menu do navegador');
    }

    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return null; // Não mostra nada se já estiver instalado
  }

  return (
    <>
      {isInstallable && (
        <Button 
          onClick={handleInstallClick}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Download size={16} />
          Instalar App
        </Button>
      )}
    </>
  );
};

export default InstallPWA;
