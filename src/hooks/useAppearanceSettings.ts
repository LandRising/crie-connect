
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings, defaultAppearance } from "@/types/profile";
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
        // Create settings object with fallbacks for fields that might not exist in database yet
        setAppearanceSettings({
          buttonStyle: data.button_style as any || "default",
          theme: data.theme as any || "light",
          buttonColor: "#000000", // Default values since these columns might not exist yet
          backgroundColor: "#ffffff",
          backgroundStyle: "solid",
          gradientColors: "",
          fontFamily: "",
          showAnalytics: false
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
      
      // Only save the fields that we know exist in the database
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
