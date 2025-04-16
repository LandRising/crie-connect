
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppearanceSettings, defaultAppearance } from "@/types/profile";
import { useAuth } from "@/components/AuthProvider";
import { ButtonStyle, ThemeType, BackgroundStyle } from "@/types/profile";

export const useAppearanceSettings = () => {
  const { user } = useAuth();
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  const fetchAppearanceSettings = async () => {
    try {
      if (!user) return;
      
      console.log("Fetching appearance settings for user:", user.id);
      
      const { data, error } = await supabase
        .from("appearance_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Erro ao buscar configurações de aparência:', error);
        return;
      }
      
      console.log("Appearance settings from database:", data);
      
      if (data) {
        // Create settings object with fallbacks for fields that might not exist in database yet
        const settings: AppearanceSettings = {
          buttonStyle: (data.button_style as ButtonStyle) || defaultAppearance.buttonStyle,
          theme: (data.theme as ThemeType) || defaultAppearance.theme,
          buttonColor: data.button_color || defaultAppearance.buttonColor,
          backgroundColor: data.background_color || defaultAppearance.backgroundColor,
          backgroundStyle: (data.background_style as BackgroundStyle) || defaultAppearance.backgroundStyle,
          backgroundImage: data.background_image || "", 
          gradientColors: data.gradient_colors || "",
          fontFamily: data.font_family || "default",
          customFontUrl: data.custom_font_url || "",
          iconStyle: data.icon_style || "",
          customIcons: typeof data.custom_icons === 'object' && data.custom_icons !== null 
            ? data.custom_icons as Record<string, string> 
            : {},
          layoutTemplate: data.layout_template || "standard",
          layoutSettings: typeof data.layout_settings === 'object' && data.layout_settings !== null 
            ? data.layout_settings as Record<string, any> 
            : {},
          showAnalytics: data.show_analytics || false
        };
        
        console.log("Processed appearance settings:", settings);
        setAppearanceSettings(settings);
      } else {
        console.log("No appearance settings found, using defaults");
        setAppearanceSettings(defaultAppearance);
      }
      
      setInitialized(true);
    } catch (error: any) {
      console.error('Erro ao buscar configurações de aparência:', error);
    }
  };

  // Upload background image file
  const uploadBackgroundImage = async (file: File): Promise<string | null> => {
    if (!user) return null;
    
    const fileName = `background-${user.id}-${Date.now()}`;
    const filePath = `backgrounds/${fileName}`;
    
    console.log("Uploading background image:", filePath);
    
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
      
    console.log("Background image uploaded, public URL:", publicUrl);
    return publicUrl;
  };

  const saveAppearanceSettings = async (settings: AppearanceSettings) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let backgroundImageUrl = settings.backgroundImage;
      
      // Upload background image if changed
      if (backgroundFile) {
        console.log("New background file detected, uploading...");
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
      
      // Prepare database settings object
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
      
      console.log("Saving appearance settings to database:", settingsData);
      
      let error;
      
      if (data) {
        // Update existing settings
        console.log("Updating existing settings record:", data.id);
        ({ error } = await supabase
          .from("appearance_settings")
          .update(settingsData)
          .eq("id", data.id));
      } else {
        // Insert new settings
        console.log("Creating new settings record");
        ({ error } = await supabase
          .from("appearance_settings")
          .insert(settingsData));
      }
      
      if (error) throw error;
      
      console.log("Settings saved successfully");
      setAppearanceSettings(settings);
      setBackgroundFile(null);
      
      // Refetch to ensure we have the latest data
      fetchAppearanceSettings();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchAppearanceSettings();
    }
  }, [user]);

  return {
    appearanceSettings,
    backgroundFile,
    isLoading,
    initialized,
    fetchAppearanceSettings,
    saveAppearanceSettings,
    setAppearanceSettings,
    setBackgroundFile
  };
};
