
import { useState, useEffect } from 'react';
import { AppearanceSettings } from '@/types/profile';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { ButtonStyle } from '@/components/AppearanceSettings';
import { ColorPicker } from './ColorPicker';

interface ButtonStylesProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

const ButtonStyles = ({ settings, onSettingsChange }: ButtonStylesProps) => {
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(settings);
  
  // Update local state when parent settings change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const getButtonPreviewStyle = (style: ButtonStyle) => {
    let baseStyle = "p-2 text-center text-sm ";
    
    switch(style) {
      case "outline":
        baseStyle += "border border-2 bg-transparent";
        break;
      case "rounded":
        baseStyle += "rounded-full";
        break;
      case "shadow":
        baseStyle += "shadow-lg";
        break;
      case "glass":
        baseStyle += "backdrop-blur-sm bg-white/20 border border-white/30";
        break;
      case "soft":
        baseStyle += "rounded-xl";
        break;
      default:
        baseStyle += "rounded-md";
    }
    
    const buttonColor = localSettings.buttonColor || '#000000';
    
    return {
      className: baseStyle,
      style: {
        backgroundColor: style === "outline" ? "transparent" : buttonColor,
        color: style === "outline" ? buttonColor : "#ffffff",
        borderColor: buttonColor
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Escolha o estilo dos botões</Label>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(["default", "outline", "rounded", "shadow", "glass", "soft"] as const).map((style) => {
            const buttonPreview = getButtonPreviewStyle(style);
            
            return (
              <div 
                key={style}
                className={`border rounded-md p-4 cursor-pointer transition-all ${
                  localSettings.buttonStyle === style ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => updateSettings({ buttonStyle: style })}
              >
                <div className="flex justify-between mb-2">
                  <span className="capitalize">{style}</span>
                  {localSettings.buttonStyle === style && <Check size={18} className="text-primary" />}
                </div>
                <div 
                  className={buttonPreview.className}
                  style={buttonPreview.style}
                >
                  Exemplo de Botão
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label>Cor dos botões</Label>
        <ColorPicker
          color={localSettings.buttonColor || '#000000'}
          onChange={(color) => updateSettings({ buttonColor: color })}
          label="Cor principal"
        />
        
        <div className="mt-6 space-y-2">
          <Label>Visualização</Label>
          <div className="border rounded-md p-4 bg-muted/50">
            <div className="space-y-3">
              <div 
                className={getButtonPreviewStyle(localSettings.buttonStyle).className}
                style={getButtonPreviewStyle(localSettings.buttonStyle).style}
              >
                Botão Principal
              </div>
              <div 
                className={getButtonPreviewStyle(localSettings.buttonStyle).className}
                style={getButtonPreviewStyle(localSettings.buttonStyle).style}
              >
                Instagram
              </div>
              <div 
                className={getButtonPreviewStyle(localSettings.buttonStyle).className}
                style={getButtonPreviewStyle(localSettings.buttonStyle).style}
              >
                Website
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonStyles;
