
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
      return;
    }

    // Show the install prompt
    console.log("Showing installation prompt");
    await window.deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await window.deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the prompt, it can't be used again
    window.deferredPrompt = null;
    setIsInstallable(false);
  };

  // Don't show the button if it's already installed
  if (isInstalled) {
    return null;
  }

  // Always show the button on mobile devices, even if we don't think it's installable yet
  // This helps in cases where the beforeinstallprompt event might not fire correctly
  return (
    <Button
      onClick={handleInstallClick}
      variant="default"
      size="sm"
      className="shadow-lg animate-pulse"
    >
      <Download className="mr-2 h-4 w-4" />
      Instalar App
    </Button>
  );
};

export default InstallPWA;
