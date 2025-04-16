
import { AppearanceSettings } from '@/types/profile';
import AppearanceButtonStyles from '@/components/profile/editor/appearance/ButtonStyles';

type ButtonStylesTabProps = {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
};

const ButtonStylesTab = ({ settings, onSettingsChange }: ButtonStylesTabProps) => {
  return (
    <AppearanceButtonStyles 
      settings={settings} 
      onSettingsChange={onSettingsChange} 
    />
  );
};

export default ButtonStylesTab;
