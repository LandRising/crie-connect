import { useState, useEffect } from 'react';
import { AppearanceSettings } from '@/types/profile';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LayoutSettingsProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

const layoutTemplates = [
  {
    id: 'standard',
    name: 'Padrão',
    description: 'Layout clássico com foto de perfil centralizada',
    preview: '/placeholder.svg'
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Layout com foto de perfil à esquerda e informações à direita',
    preview: '/placeholder.svg'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Layout simples com foco nos links',
    preview: '/placeholder.svg'
  },
  {
    id: 'creative',
    name: 'Criativo',
    description: 'Layout artístico com elementos decorativos',
    preview: '/placeholder.svg'
  },
];

const LayoutSettings = ({ settings, onSettingsChange }: LayoutSettingsProps) => {
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(settings);
  
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const updateSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const updateLayoutSettings = (key: string, value: any) => {
    updateSettings({
      layoutSettings: {
        ...(localSettings.layoutSettings || {}),
        [key]: value
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Escolha um template de layout</Label>
        
        <RadioGroup 
          value={localSettings.layoutTemplate || 'standard'}
          onValueChange={(value) => updateSettings({ layoutTemplate: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {layoutTemplates.map(template => (
            <div key={template.id} className="relative">
              <RadioGroupItem 
                value={template.id} 
                id={template.id} 
                className="absolute top-4 left-4 z-10" 
              />
              <label 
                htmlFor={template.id}
                className={`block border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  localSettings.layoutTemplate === template.id ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="h-32 bg-muted rounded mb-3"></div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="space-y-4">
        <Label>Opções de exibição</Label>
        
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-analytics" className="block font-medium">Mostrar estatísticas no perfil</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe estatísticas de visitas no seu perfil público
                </p>
              </div>
              <Switch 
                id="show-analytics"
                checked={localSettings.showAnalytics || false}
                onCheckedChange={(checked) => updateSettings({ showAnalytics: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-avatar" className="block font-medium">Mostrar foto de perfil</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe sua foto de perfil para os visitantes
                </p>
              </div>
              <Switch 
                id="show-avatar"
                checked={(localSettings.layoutSettings?.showAvatar ?? true)}
                onCheckedChange={(checked) => updateLayoutSettings('showAvatar', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-bio" className="block font-medium">Mostrar biografia</Label>
                <p className="text-sm text-muted-foreground">
                  Exibe sua biografia no perfil
                </p>
              </div>
              <Switch 
                id="show-bio"
                checked={(localSettings.layoutSettings?.showBio ?? true)}
                onCheckedChange={(checked) => updateLayoutSettings('showBio', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LayoutSettings;
