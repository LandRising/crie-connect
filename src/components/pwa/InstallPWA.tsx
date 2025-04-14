
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/components/ui/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Make deferredPrompt available globally
declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

const InstallPWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if already installed as PWA
    const checkInstalledStatus = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        console.log("PWA is already installed");
        setIsInstalled(true);
        return true;
      }
      return false;
    };

    // Check if already installed
    if (checkInstalledStatus()) {
      return;
    }

    // Check if install prompt is already available
    if (window.deferredPrompt) {
      console.log("Install prompt is already available");
      setIsInstallable(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt captured in component');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    // Check if installed via app install status
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      window.deferredPrompt = null;
      toast({
        title: "Instalação concluída",
        description: "O aplicativo foi instalado com sucesso!",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!window.deferredPrompt) {
      console.log("No installation prompt available");
      toast({
        title: "Instalação não disponível",
        description: "Seu navegador não suporta ou já tem o app instalado.",
        variant: "destructive",
      });
      return;
    }

    // Show the install prompt
    console.log("Showing installation prompt");
    try {
      await window.deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await window.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        toast({
          title: "Instalação iniciada",
          description: "O aplicativo está sendo instalado.",
        });
      } else {
        console.log('User dismissed the install prompt');
        toast({
          title: "Instalação cancelada",
          description: "Você cancelou a instalação do aplicativo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Installation error:', error);
      toast({
        title: "Erro na instalação",
        description: "Ocorreu um erro ao tentar instalar o aplicativo.",
        variant: "destructive",
      });
    } finally {
      // Clear the prompt, it can't be used again
      window.deferredPrompt = null;
      setIsInstallable(false);
    }
  };

  // Don't show the button if it's already installed or if user is not logged in
  if (isInstalled || !user) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="default"
      size="sm"
      className="shadow-lg"
    >
      <Download className="mr-2 h-4 w-4" />
      Instalar App
    </Button>
  );
};

export default InstallPWA;
