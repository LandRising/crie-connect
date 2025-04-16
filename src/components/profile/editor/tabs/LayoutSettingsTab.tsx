
import { AppearanceSettings } from '@/types/profile';
import AppearanceLayout from '@/components/profile/editor/appearance/LayoutSettings';

type LayoutSettingsTabProps = {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
};

const LayoutSettingsTab = ({ settings, onSettingsChange }: LayoutSettingsTabProps) => {
  return (
    <AppearanceLayout 
      settings={settings} 
      onSettingsChange={onSettingsChange} 
    />
  );
};

export default LayoutSettingsTab;
