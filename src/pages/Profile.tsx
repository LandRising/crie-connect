
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonStyle, ThemeType } from "@/components/AppearanceSettings";

type ProfileLink = {
  id: string;
  title: string;
  url: string;
};

type ProfileData = {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

type AppearanceSettings = {
  buttonStyle: ButtonStyle;
  theme: ThemeType;
};

// Default appearance settings
const defaultAppearance: AppearanceSettings = {
  buttonStyle: "default",
  theme: "light",
};

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [links, setLinks] = useState<ProfileLink[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appearance, setAppearance] = useState<AppearanceSettings>(defaultAppearance);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError) throw profileError;
        if (!profileData) throw new Error("Perfil não encontrado");

        setProfile(profileData);

        // Fetch links
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("id, title, url")
          .eq("user_id", profileData.id)
          .eq("active", true)
          .order("order_position");

        if (linksError) throw linksError;
        setLinks(linksData || []);
        
        // Fetch appearance settings
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

  const getButtonStyles = (buttonStyle: string) => {
    switch (buttonStyle) {
      case "outline":
        return "bg-transparent border-2 border-black text-black hover:bg-gray-100";
      case "rounded":
        return "bg-black text-white rounded-full hover:bg-gray-800";
      case "default":
      default:
        return "bg-black text-white hover:bg-gray-800";
    }
  };

  const getThemeStyles = (theme: string) => {
    if (theme === "dark") {
      return {
        background: "bg-gray-900",
        text: "text-white",
        subtext: "text-gray-300"
      };
    }
    return {
      background: "bg-white",
      text: "text-black",
      subtext: "text-gray-500"
    };
  };

  const themeStyles = getThemeStyles(appearance.theme);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
        <p className="mb-6">{error || "Este usuário não existe."}</p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex flex-col items-center p-4 py-12", themeStyles.background)}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {profile.avatar_url && (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || profile.username}
              className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
            />
          )}
          <h1 className={cn("text-2xl font-bold", themeStyles.text)}>
            {profile.full_name || profile.username}
          </h1>
          <p className={cn(themeStyles.subtext)}>@{profile.username}</p>
        </div>

        <div className="space-y-3">
          {links.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum link disponível</p>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between h-auto py-4 px-6 text-base font-medium",
                    getButtonStyles(appearance.buttonStyle)
                  )}
                >
                  {link.title}
                  <ExternalLink size={18} />
                </Button>
              </a>
            ))
          )}
        </div>
      </div>
      
      <footer className={cn("mt-12 text-center text-sm", themeStyles.subtext)}>
        <p>Criado com CRIE Connect</p>
      </footer>
    </div>
  );
};

export default Profile;
