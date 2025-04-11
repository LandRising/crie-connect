
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export type ButtonStyle = "default" | "outline" | "rounded";
export type AppearanceSettings = {
  buttonStyle: ButtonStyle;
  theme: "light" | "dark";
};

type AppearanceSettingsProps = {
  initialSettings?: AppearanceSettings;
  onSave: (settings: AppearanceSettings) => void;
};

const defaultSettings: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
};

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
          .from('appearance_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Erro ao carregar configurações de aparência:', error);
          return;
        }
        
        if (data) {
          setSettings({
            buttonStyle: data.button_style as ButtonStyle || defaultSettings.buttonStyle,
            theme: data.theme || defaultSettings.theme
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
        .from('appearance_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      const settingsData = {
        user_id: user.id,
        button_style: settings.buttonStyle,
        theme: settings.theme,
        updated_at: new Date().toISOString()
      };
      
      let error;
      
      if (data) {
        // Update existing settings
        ({ error } = await supabase
          .from('appearance_settings')
          .update(settingsData)
          .eq('id', data.id));
      } else {
        // Insert new settings
        ({ error } = await supabase
          .from('appearance_settings')
          .insert([settingsData]));
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalizar Aparência</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="button-style">
          <TabsList className="mb-4">
            <TabsTrigger value="button-style">Estilo de Botões</TabsTrigger>
            <TabsTrigger value="theme">Tema</TabsTrigger>
          </TabsList>
          
          <TabsContent value="button-style">
            <div className="space-y-4">
              <Label>Escolha o estilo dos botões</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    settings.buttonStyle === "default" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSettings({ ...settings, buttonStyle: "default" })}
                >
                  <div className="flex justify-between mb-2">
                    <span>Padrão</span>
                    {settings.buttonStyle === "default" && <Check size={18} className="text-primary" />}
                  </div>
                  <div className="bg-primary text-white p-2 text-center text-sm rounded-md">
                    Exemplo de Botão
                  </div>
                </div>
                
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    settings.buttonStyle === "outline" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSettings({ ...settings, buttonStyle: "outline" })}
                >
                  <div className="flex justify-between mb-2">
                    <span>Contorno</span>
                    {settings.buttonStyle === "outline" && <Check size={18} className="text-primary" />}
                  </div>
                  <div className="border border-black text-black p-2 text-center text-sm rounded-md">
                    Exemplo de Botão
                  </div>
                </div>
                
                <div 
                  className={`border rounded-md p-4 cursor-pointer transition-all ${
                    settings.buttonStyle === "rounded" ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSettings({ ...settings, buttonStyle: "rounded" })}
                >
                  <div className="flex justify-between mb-2">
                    <span>Arredondado</span>
                    {settings.buttonStyle === "rounded" && <Check size={18} className="text-primary" />}
                  </div>
                  <div className="bg-primary text-white p-2 text-center text-sm rounded-full">
                    Exemplo de Botão
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="theme">
            <div className="space-y-4">
              <Label>Escolha o tema</Label>
              
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => 
                  setSettings({ ...settings, theme: value as "light" | "dark" })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Claro</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Escuro</Label>
                </div>
              </RadioGroup>
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
