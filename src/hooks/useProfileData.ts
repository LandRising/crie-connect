
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileData, ProfileLink, AppearanceSettings, defaultAppearance } from "@/types/profile";

export const useProfileData = (username: string | undefined) => {
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Perfil não encontrado");

        setProfile(profileData);

        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("id, title, url")
          .eq("user_id", profileData.id)
          .eq("active", true)
          .order("order_position");

        if (linksError) throw linksError;
        setLinks(linksData || []);
        
        const { data: appearanceData, error: appearanceError } = await supabase
          .from("appearance_settings")
          .select("*")
          .eq("user_id", profileData.id)
          .maybeSingle();
          
        if (appearanceError) {
          console.error('Erro ao buscar configurações de aparência:', appearanceError);
        }
        
        if (appearanceData) {
          setAppearance({
            buttonStyle: appearanceData.button_style as ButtonStyle || defaultAppearance.buttonStyle,
            theme: appearanceData.theme as ThemeType || defaultAppearance.theme
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  return { links, profile, loading, error, appearance };
};

import { ButtonStyle, ThemeType } from "@/components/AppearanceSettings";
