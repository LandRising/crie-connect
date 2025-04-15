
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Check, Grid3X3, Palette, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ButtonStyle = "default" | "outline" | "rounded" | "shadow" | "glass" | "soft";
export type ThemeType = "light" | "dark" | "black" | "purple" | "blue";
export type BackgroundStyle = "solid" | "gradient";

export type AppearanceSettings = {
  buttonStyle: ButtonStyle;
  theme: ThemeType;
  buttonColor?: string;
  backgroundColor?: string;
  backgroundStyle?: BackgroundStyle;
  gradientColors?: string;
  fontFamily?: string;
  showAnalytics?: boolean;
};

type AppearanceSettingsProps = {
  initialSettings?: AppearanceSettings;
  onSave: (settings: AppearanceSettings) => void;
};

const defaultSettings: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
  buttonColor: "#000000",
  backgroundColor: "#ffffff",
  backgroundStyle: "solid",
  gradientColors: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  fontFamily: "",
  showAnalytics: false,
};

const fontOptions = [
  { value: "", label: "Padrão" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Lato", label: "Lato" },
  { value: "Poppins", label: "Poppins" },
];

const gradientOptions = [
  { value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", label: "Nuvem" },
  { value: "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)", label: "Oceano" },
  { value: "linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)", label: "Rosa" },
  { value: "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)", label: "Menta" },
  { value: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)", label: "Flamingo" },
];

const AppearanceSettings = ({ 
  initialSettings = defaultSettings, 
  onSave 
}: AppearanceSettingsProps) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppearanceSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch settings from database when component mounts
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("appearance_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Erro ao carregar configurações de aparência:', error);
          return;
        }
        
        if (data) {
          setSettings({
            buttonStyle: data.button_style as ButtonStyle || defaultSettings.buttonStyle,
            theme: data.theme as ThemeType || defaultSettings.theme,
            buttonColor: data.button_color || defaultSettings.buttonColor,
            backgroundColor: data.background_color || defaultSettings.backgroundColor,
            backgroundStyle: data.background_style as BackgroundStyle || defaultSettings.backgroundStyle,
            gradientColors: data.gradient_colors || defaultSettings.gradientColors,
            fontFamily: data.font_family || defaultSettings.fontFamily,
            showAnalytics: data.show_analytics || defaultSettings.showAnalytics,
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };
    
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Check if settings already exist for this user
      const { data, error: fetchError } = await supabase
        .from("appearance_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Erro ao verificar configurações existentes:', fetchError);
      }
      
      const settingsData = {
        user_id: user.id,
        button_style: settings.buttonStyle,
        theme: settings.theme,
        button_color: settings.buttonColor,
        background_color: settings.backgroundColor,
        background_style: settings.backgroundStyle,
        gradient_colors: settings.gradientColors,
        font_family: settings.fontFamily,
        show_analytics: settings.showAnalytics,
        updated_at: new Date().toISOString()
      };
      
      let error;
      
      if (data) {
        // Update existing settings
        ({ error } = await supabase
          .from("appearance_settings")
          .update(settingsData)
          .eq("id", data.id));
      } else {
        // Insert new settings
        ({ error } = await supabase
          .from("appearance_settings")
          .insert(settingsData));
      }
      
      if (error) throw error;
      
      onSave(settings);
      
      toast({
        title: "Aparência salva com sucesso",
        description: "Suas configurações foram atualizadas"
      });
    } catch (error: any) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonPreviewStyle = () => {
    let baseStyle = "p-2 text-center text-sm ";
    
    switch(settings.buttonStyle) {
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
    
    return {
      className: baseStyle,
      style: {
        backgroundColor: settings.buttonStyle === "outline" ? "transparent" : settings.buttonColor,
        color: settings.buttonStyle === "outline" ? settings.buttonColor : "#ffffff",
        borderColor: settings.buttonColor
      }
    };
  };

  const buttonPreview = getButtonPreviewStyle();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalizar Aparência</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="button-style">
          <TabsList className="mb-4">
            <TabsTrigger value="button-style" className="flex items-center gap-2">
              <Grid3X3 size={16} /> Botões
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette size={16} /> Cores e Fundo
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type size={16} /> Tipografia
            </TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="button-style">
            <div className="space-y-4">
              <Label>Escolha o estilo dos botões</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(["default", "outline", "rounded", "shadow", "glass", "soft"] as const).map((style) => (
                  <div 
                    key={style}
                    className={`border rounded-md p-4 cursor-pointer transition-all ${
                      settings.buttonStyle === style ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSettings({ ...settings, buttonStyle: style })}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="capitalize">{style}</span>
                      {settings.buttonStyle === style && <Check size={18} className="text-primary" />}
                    </div>
                    <div 
                      className={getButtonPreviewStyle().className}
                      style={style === settings.buttonStyle ? buttonPreview.style : {}}
                    >
                      Exemplo de Botão
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Label htmlFor="buttonColor" className="mb-2 block">
                  Cor dos botões
                </Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-8 w-8 rounded-full border overflow-hidden cursor-pointer"
                    style={{ backgroundColor: settings.buttonColor }}
                    onClick={() => document.getElementById('buttonColor')?.click()}
                  />
                  <Input
                    id="buttonColor"
                    type="color"
                    value={settings.buttonColor}
                    onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                    className="w-auto h-10"
                  />
                  <span className="text-sm">{settings.buttonColor}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="colors">
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Estilo de fundo</Label>
                <ToggleGroup 
                  type="single" 
                  value={settings.backgroundStyle} 
                  onValueChange={(value) => value && setSettings({ 
                    ...settings, 
                    backgroundStyle: value as BackgroundStyle 
                  })}
                >
                  <ToggleGroupItem value="solid">Cor sólida</ToggleGroupItem>
                  <ToggleGroupItem value="gradient">Gradiente</ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {settings.backgroundStyle === 'solid' ? (
                <div>
                  <Label htmlFor="backgroundColor" className="mb-2 block">
                    Cor de fundo
                  </Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-8 w-8 rounded-full border overflow-hidden cursor-pointer"
                      style={{ backgroundColor: settings.backgroundColor }}
                      onClick={() => document.getElementById('backgroundColor')?.click()}
                    />
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                      className="w-auto h-10"
                    />
                    <span className="text-sm">{settings.backgroundColor}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="mb-2 block">Gradientes</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gradientOptions.map((gradient) => (
                      <div
                        key={gradient.value}
                        className={`h-20 rounded-md cursor-pointer transition-all ${
                          settings.gradientColors === gradient.value ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ background: gradient.value }}
                        onClick={() => setSettings({ ...settings, gradientColors: gradient.value })}
                      >
                        <div className="h-full w-full flex items-end p-2">
                          <span className="text-xs font-medium text-white drop-shadow-md">{gradient.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Tema do perfil</Label>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => 
                    setSettings({ ...settings, theme: value as ThemeType })
                  }
                  className="mt-2"
                >
                  <div className="flex flex-wrap gap-4">
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
          </TabsContent>
          
          <TabsContent value="typography">
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontFamily" className="mb-2 block">
                  Fonte
                </Label>
                <Select
                  value={settings.fontFamily}
                  onValueChange={(value) => setSettings({ ...settings, fontFamily: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem 
                        key={font.value} 
                        value={font.value}
                        style={{ fontFamily: font.value ? `${font.value}, sans-serif` : undefined }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {settings.fontFamily && (
                <div className="p-4 border rounded-md">
                  <p className="text-lg font-medium mb-2" style={{ fontFamily: `${settings.fontFamily}, sans-serif` }}>
                    Visualização da fonte {settings.fontFamily}
                  </p>
                  <p style={{ fontFamily: `${settings.fontFamily}, sans-serif` }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-analytics" className="block font-medium">Mostrar estatísticas no perfil</Label>
                  <p className="text-sm text-gray-500">
                    Exibe estatísticas de visitas no seu perfil público
                  </p>
                </div>
                <Switch 
                  id="show-analytics"
                  checked={settings.showAnalytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, showAnalytics: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Aparência"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
