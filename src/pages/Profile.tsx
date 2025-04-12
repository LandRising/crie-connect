
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfileData } from "@/hooks/useProfileData";
import { getThemeStyles, getButtonStyles } from "@/utils/profileStyles";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { ShareButton } from "@/components/profile/ShareButton";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { links, profile, loading, error, appearance } = useProfileData(username);

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
    <div className={cn("min-h-screen flex flex-col items-center", themeStyles.background)}>
      <ProfileCover coverUrl={profile.cover_url} />

      <div className="w-full max-w-md px-4 py-12 relative">
        <ShareButton profile={profile} themeTextColor={themeStyles.text} />
        
        <ProfileHeader profile={profile} themeStyles={themeStyles} />

        <ProfileLinks 
          links={links} 
          buttonStyle={appearance.buttonStyle}
          getButtonStyles={getButtonStyles}
        />
      </div>
      
      <footer className={cn("mt-12 text-center text-sm pb-6", themeStyles.subtext)}>
        <p>Criado com CRIE Connect</p>
      </footer>
    </div>
  );
};

export default Profile;
