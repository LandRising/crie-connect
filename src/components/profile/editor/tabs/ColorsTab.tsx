
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
  return (
    <div className="space-y-6">
      <AppearanceColorSettings 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
      />
      
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Imagem de fundo</h3>
        <BackgroundUpload
          initialUrl={settings.backgroundImage || null}
          onFileChange={setBackgroundFile}
        />
      </div>
    </div>
  );
};

export default ColorsTab;
