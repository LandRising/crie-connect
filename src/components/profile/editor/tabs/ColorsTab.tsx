
import { AppearanceSettings } from '@/types/profile';
import AppearanceColorSettings from '@/components/profile/editor/appearance/ColorSettings';
import { BackgroundUpload } from '@/components/profile/editor/BackgroundUpload';
import { Label } from '@/components/ui/label';

type ColorsTabProps = {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
  setBackgroundFile: (file: File | null) => void;
};

const ColorsTab = ({ settings, onSettingsChange, setBackgroundFile }: ColorsTabProps) => {
  const handleBackgroundImageChange = (file: File | null) => {
    setBackgroundFile(file);
    
    // If removing the image, also update the background style
    if (!file && settings.backgroundStyle === 'image') {
      onSettingsChange({
        ...settings,
        backgroundStyle: 'solid'
      });
    } else if (file) {
      // If adding an image, set the background style to image
      onSettingsChange({
        ...settings,
        backgroundStyle: 'image'
      });
    }
  };

  return (
    <div className="space-y-6">
      <AppearanceColorSettings 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
      />
      
      <div className="space-y-2">
        <Label className="text-base font-medium">Imagem de fundo</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Faça upload de uma imagem personalizada para o fundo do seu perfil
        </p>
        <BackgroundUpload
          initialUrl={settings.backgroundImage || null}
          onFileChange={handleBackgroundImageChange}
        />
      </div>
    </div>
  );
};

export default ColorsTab;
