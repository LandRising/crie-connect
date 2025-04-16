
import { useState, useEffect } from 'react';
import { AppearanceSettings } from '@/types/profile';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface TypographyProps {
  settings: AppearanceSettings;
  onSettingsChange: (settings: AppearanceSettings) => void;
}

// Available font options with font families that are web-safe or common Google Fonts
const fontOptions = [
  { value: "default", label: "Padrão" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Lato", label: "Lato" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Inter", label: "Inter" },
  { value: "Nunito", label: "Nunito" },
  { value: "Raleway", label: "Raleway" },
];

// Dynamically load Google Fonts when selected
const loadGoogleFont = (fontFamily: string) => {
  if (fontFamily === 'default' || document.querySelector(`link[href*="${fontFamily}"]`)) {
    return;
  }
  
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const Typography = ({ settings, onSettingsChange }: TypographyProps) => {
  const { user } = useAuth();
  const [localSettings, setLocalSettings] = useState<AppearanceSettings>(settings);
  const [customFontFile, setCustomFontFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setLocalSettings(settings);
    // Load the font if it's a Google Font
    if (settings.fontFamily && settings.fontFamily !== 'default' && settings.fontFamily !== 'custom') {
      loadGoogleFont(settings.fontFamily);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AppearanceSettings>) => {
    const newSettings = { ...localSettings, ...updates };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    // Load the font if changing to a Google Font
    if (updates.fontFamily && updates.fontFamily !== 'default' && updates.fontFamily !== 'custom') {
      loadGoogleFont(updates.fontFamily);
    }
  };

  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf') && !file.name.endsWith('.woff') && !file.name.endsWith('.woff2')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo de fonte válido (ttf, otf, woff, woff2)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 2MB",
        variant: "destructive"
      });
      return;
    }
    
    setCustomFontFile(file);
  };

  const uploadCustomFont = async () => {
    if (!customFontFile || !user) return;
    
    setIsUploading(true);
    
    try {
      const fileName = `font-${user.id}-${Date.now()}.${customFontFile.name.split('.').pop()}`;
      const filePath = `fonts/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from("profiles")
        .upload(filePath, customFontFile);
        
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from("profiles")
        .getPublicUrl(filePath);
      
      // Create a style element to load the custom font
      const fontFaceStyle = document.createElement('style');
      fontFaceStyle.textContent = `
        @font-face {
          font-family: 'CustomFont';
          src: url('${publicUrl}') format('${customFontFile.name.endsWith('.ttf') ? 'truetype' : 
                  customFontFile.name.endsWith('.otf') ? 'opentype' : 
                  customFontFile.name.endsWith('.woff') ? 'woff' : 'woff2'}');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(fontFaceStyle);
        
      updateSettings({ 
        customFontUrl: publicUrl,
        fontFamily: 'custom'
      });
      
      toast({
        title: "Fonte enviada",
        description: "Sua fonte personalizada foi enviada com sucesso"
      });
    } catch (error: any) {
      console.error('Erro ao enviar fonte:', error);
      toast({
        title: "Erro ao enviar fonte",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setCustomFontFile(null);
    }
  };

  // Load custom font if it exists
  useEffect(() => {
    if (settings.customFontUrl && settings.fontFamily === 'custom') {
      const fontExt = settings.customFontUrl.split('.').pop() || '';
      const fontFormat = 
        fontExt === 'ttf' ? 'truetype' : 
        fontExt === 'otf' ? 'opentype' : 
        fontExt === 'woff' ? 'woff' : 'woff2';
      
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'CustomFont';
          src: url('${settings.customFontUrl}') format('${fontFormat}');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    }
  }, [settings.customFontUrl, settings.fontFamily]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="fontFamily" className="mb-2 block">
          Escolha a fonte
        </Label>
        <Select
          value={localSettings.fontFamily || "default"}
          onValueChange={(value) => updateSettings({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Escolha uma fonte" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value !== "default" ? `${font.value}, sans-serif` : undefined }}
              >
                {font.label}
              </SelectItem>
            ))}
            {localSettings.customFontUrl && (
              <SelectItem value="custom" style={{ fontFamily: 'CustomFont, sans-serif' }}>
                Fonte Personalizada
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Fonte personalizada</Label>
        <div className="border rounded-md p-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Você pode enviar sua própria fonte para usar no seu perfil.
              Formatos suportados: .ttf, .otf, .woff, .woff2
            </p>
            
            <div className="flex items-center gap-2">
              <Input 
                type="file"
                id="font-upload"
                onChange={handleFontFileChange}
                accept=".ttf,.otf,.woff,.woff2"
                className="flex-1"
              />
              
              <Button 
                onClick={uploadCustomFont} 
                disabled={!customFontFile || isUploading}
                className="whitespace-nowrap"
                size="sm"
              >
                {isUploading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Enviar
              </Button>
            </div>
            
            {localSettings.customFontUrl && (
              <div>
                <p className="text-sm">Fonte personalizada carregada</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => updateSettings({ customFontUrl: '', fontFamily: 'default' })}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  Remover fonte
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {localSettings.fontFamily && localSettings.fontFamily !== "default" && (
        <div className="p-4 border rounded-md">
          <p className="text-lg font-medium mb-2" style={{ 
            fontFamily: localSettings.fontFamily === "custom" 
              ? 'CustomFont, sans-serif' 
              : `${localSettings.fontFamily}, sans-serif` 
          }}>
            Visualização da fonte
          </p>
          <p style={{ 
            fontFamily: localSettings.fontFamily === "custom" 
              ? 'CustomFont, sans-serif' 
              : `${localSettings.fontFamily}, sans-serif` 
          }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      )}
    </div>
  );
};

export default Typography;
