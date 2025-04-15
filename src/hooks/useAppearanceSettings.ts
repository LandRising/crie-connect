
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings, defaultAppearance } from "@/types/profile";
import { useAuth } from "@/components/AuthProvider";

export const useAppearanceSettings = () => {
  const { user } = useAuth();
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
          buttonColor: data.button_color || "#000000",
          backgroundColor: data.background_color || "#ffffff",
          backgroundStyle: data.background_style as any || "solid",
          backgroundImage: data.background_image || "",
          gradientColors: data.gradient_colors || "",
          fontFamily: data.font_family || "default",
          customFontUrl: data.custom_font_url || "",
          iconStyle: data.icon_style || "",
          customIcons: data.custom_icons || {},
          layoutTemplate: data.layout_template || "standard",
          layoutSettings: data.layout_settings || {},
          showAnalytics: data.show_analytics || false
        });
      } else {
        setAppearanceSettings(defaultAppearance);
      }
    } catch (error: any) {
      console.error('Erro ao buscar configurações de aparência:', error);
    }
  };

  // Upload background image file
  const uploadBackgroundImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileName = `background-${user.id}-${Date.now()}`;
    const filePath = `backgrounds/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);
      
    if (error) {
      console.error('Erro ao fazer upload da imagem de fundo:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  const saveAppearanceSettings = async (settings: AppearanceSettings) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let backgroundImageUrl = settings.backgroundImage;
      
      // Upload background image if changed
      if (backgroundFile) {
        const uploadedUrl = await uploadBackgroundImage(backgroundFile);
        if (uploadedUrl) {
          backgroundImageUrl = uploadedUrl;
          settings.backgroundImage = uploadedUrl;
        }
      }
      
      const { data, error: fetchError } = await supabase
        .from("appearance_settings")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      
      // Only save the fields that we know exist in the database
      // Add support for new fields as needed
      const settingsData = {
        user_id: user.id,
        button_style: settings.buttonStyle,
        theme: settings.theme,
        button_color: settings.buttonColor,
        background_color: settings.backgroundColor,
        background_style: settings.backgroundStyle,
        background_image: backgroundImageUrl,
        gradient_colors: settings.gradientColors,
        font_family: settings.fontFamily === "default" ? "" : settings.fontFamily,
        custom_font_url: settings.customFontUrl,
        icon_style: settings.iconStyle,
        custom_icons: settings.customIcons,
        layout_template: settings.layoutTemplate,
        layout_settings: settings.layoutSettings,
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
      setBackgroundFile(null);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppearanceSettings();
  }, [user]);

  return {
    appearanceSettings,
    backgroundFile,
    isLoading,
    fetchAppearanceSettings,
    saveAppearanceSettings,
    setBackgroundFile
  };
};
