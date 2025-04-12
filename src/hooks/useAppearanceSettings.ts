
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings as AppearanceSettingsType } from "@/components/AppearanceSettings";
import { useAuth } from "@/components/AuthProvider";

export const useAppearanceSettings = () => {
  const { user } = useAuth();
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettingsType | null>(null);
  
  const fetchAppearanceSettings = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("appearance_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Erro ao buscar configurações de aparência:', error);
        return;
      }
      
      if (data) {
        setAppearanceSettings({
          buttonStyle: data.button_style as any || "default",
          theme: data.theme as any || "light"
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar configurações de aparência:', error);
    }
  };

  const saveAppearanceSettings = async (settings: AppearanceSettingsType) => {
    setAppearanceSettings(settings);
    fetchAppearanceSettings(); // Refresh settings after save
  };

  useEffect(() => {
    fetchAppearanceSettings();
  }, [user]);

  return {
    appearanceSettings,
    fetchAppearanceSettings,
    saveAppearanceSettings
  };
};
