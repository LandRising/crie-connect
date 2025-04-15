
import { useParams } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { ShareButton } from "@/components/profile/ShareButton";
import { ProfileAnalytics } from "@/components/analytics/ProfileAnalytics";
import { useProfileData } from "@/hooks/useProfileData";
import { getButtonStyles, getThemeStyles } from "@/utils/profileStyles";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useProfileVisit } from "@/hooks/useProfileVisit";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, links, loading, error, appearance } = useProfileData(username || "");
  
  // Registrar visita ao perfil para analytics
  useProfileVisit(username, profile?.id);

  // Definir o título da página com base no perfil
  useEffect(() => {
    if (profile) {
      document.title = `${profile.full_name || profile.username} | Crie Connect`;
    } else {
      document.title = "Perfil | Crie Connect";
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-40 bg-muted animate-pulse" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4">
          <div className="flex items-center mb-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="ml-4 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Perfil não encontrado</h2>
          <p className="text-muted-foreground">O usuário que você procura não existe ou está indisponível.</p>
        </div>
      </div>
    );
  }

  // Aplicar estilos de tema personalizados
  const themeStyles = getThemeStyles(appearance.theme);
  const bgStyle = appearance.backgroundStyle || "solid";
  const bgColor = appearance.backgroundColor || (appearance.theme === 'dark' ? '#1A1F2C' : '#ffffff');
  const customFont = appearance.fontFamily || '';

  // Aplicar gradiente ou cor sólida de fundo
  const backgroundStyles = bgStyle === 'gradient' && appearance.gradientColors 
    ? { background: appearance.gradientColors } 
    : { backgroundColor: bgColor };

  return (
    <div 
      className={`min-h-screen-safe ${themeStyles.background}`}
      style={{
        ...backgroundStyles,
        fontFamily: customFont ? `${customFont}, sans-serif` : 'inherit'
      }}
    >
      <ProfileCover coverUrl={profile.cover_url} />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4">
        <ShareButton profile={profile} themeStyles={themeStyles} />
        
        <ProfileHeader profile={profile} themeStyles={themeStyles} />
        
        <ProfileLinks 
          links={links} 
          buttonStyle={appearance.buttonStyle} 
          getButtonStyles={getButtonStyles} 
          buttonColor={appearance.buttonColor}
          profileId={profile.id}
        />

        {/* Exibir analytics somente se o perfil pertencer ao usuário atual */}
        {appearance.showAnalytics && <ProfileAnalytics profileId={profile.id} />}
      </div>
    </div>
  );
};

export default Profile;
