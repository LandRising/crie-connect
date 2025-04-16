
import { AppearanceSettings } from '@/types/profile';
import AppearanceTypography from '@/components/profile/editor/appearance/Typography';

type TypographyTabProps = {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
};

const TypographyTab = ({ settings, onSettingsChange }: TypographyTabProps) => {
  return (
    <AppearanceTypography 
      settings={settings} 
      onSettingsChange={onSettingsChange} 
    />
  );
};

export default TypographyTab;
