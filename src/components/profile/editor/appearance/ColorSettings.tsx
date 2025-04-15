
import { useState, useEffect } from 'react';
import { AppearanceSettings } from '@/types/profile';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './ColorPicker';

interface ColorSettingsProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

// Available gradient presets
const gradientOptions = [
  { value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", label: "Nuvem" },
  { value: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", label: "Oceano" },
  { value: "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)", label: "Rosa" },
  { value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", label: "Menta" },
  { value: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)", label: "Flamingo" },
  { value: "linear-gradient(to right, #243949 0%, #517fa4 100%)", label: "Azul Escuro" },
  { value: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)", label: "Lavanda" },
  { value: "linear-gradient(to right, #ff8177 0%, #ff867a 0%, #ff8c7f 21%, #f99185 52%, #cf556c 78%, #b12a5b 100%)", label: "Vermelho Intenso" },
  { value: "linear-gradient(120deg, #f6d365 0%, #fda085 100%)", label: "Laranja" },
  { value: "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)", label: "Arco-Íris" },
];

const ColorSettings = ({ settings, onSettingsChange }: ColorSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Estilo de fundo</Label>
        <ToggleGroup 
          type="single" 
          value={localSettings.backgroundStyle || 'solid'} 
          onValueChange={(value) => value && updateSettings({ 
            backgroundStyle: value as any 
          })}
          className="justify-start"
        >
          <ToggleGroupItem value="solid">Cor sólida</ToggleGroupItem>
          <ToggleGroupItem value="gradient">Gradiente</ToggleGroupItem>
          <ToggleGroupItem value="image">Imagem</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      {localSettings.backgroundStyle === 'solid' && (
        <div className="space-y-2">
          <Label className="mb-2 block">Cor de fundo</Label>
          <ColorPicker
            color={localSettings.backgroundColor || '#ffffff'}
            onChange={(color) => updateSettings({ backgroundColor: color })}
          />
        </div>
      )}
      
      {localSettings.backgroundStyle === 'gradient' && (
        <div className="space-y-2">
          <Label className="mb-2 block">Gradientes</Label>
          <ScrollArea className="h-64 border rounded-md p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
              {gradientOptions.map((gradient) => (
                <div
                  key={gradient.value}
                  className={`h-20 rounded-md cursor-pointer transition-all ${
                    localSettings.gradientColors === gradient.value ? "ring-2 ring-primary" : ""
                  }`}
                  style={{ background: gradient.value }}
                  onClick={() => updateSettings({ gradientColors: gradient.value })}
                >
                  <div className="h-full w-full flex items-end p-2">
                    <span className="text-xs font-medium text-white drop-shadow-md">{gradient.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="space-y-2">
        <Label>Tema do perfil</Label>
        <RadioGroup
          value={localSettings.theme || "light"}
          onValueChange={(value) => updateSettings({ theme: value as any })}
          className="mt-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light">Claro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark">Escuro</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="black" id="black" />
              <Label htmlFor="black">Preto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="purple" id="purple" />
              <Label htmlFor="purple">Roxo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blue" id="blue" />
              <Label htmlFor="blue">Azul</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default ColorSettings;
