
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings } from "@/types/profile";
import { useAuth } from "@/components/AuthProvider";

export const useAppearanceSettings = () => {
  const { user } = useAuth();
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings | null>(null);
  
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
          theme: data.theme as any || "light",
          buttonColor: data.button_color,
          backgroundColor: data.background_color,
          backgroundStyle: data.background_style,
          gradientColors: data.gradient_colors,
          fontFamily: data.font_family,
          showAnalytics: data.show_analytics,
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar configurações de aparência:', error);
    }
  };

  const saveAppearanceSettings = async (settings: AppearanceSettings) => {
    if (!user) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from("appearance_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
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
      
      setAppearanceSettings(settings);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
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
