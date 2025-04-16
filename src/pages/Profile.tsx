
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
import { User } from "lucide-react";

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

  // Load custom font if available
  useEffect(() => {
    if (appearance?.customFontUrl && appearance?.fontFamily === 'custom') {
      const fontExt = appearance.customFontUrl.split('.').pop() || '';
      const fontFormat = 
        fontExt === 'ttf' ? 'truetype' : 
        fontExt === 'otf' ? 'opentype' : 
        fontExt === 'woff' ? 'woff' : 'woff2';
      
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: 'CustomFont';
          src: url('${appearance.customFontUrl}') format('${fontFormat}');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    } else if (appearance?.fontFamily && appearance?.fontFamily !== 'default') {
      // Load Google Font
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${appearance.fontFamily.replace(' ', '+')}:wght@400;600;700&display=swap`;
      link.rel = 'stylesheet';
      
      // Only add if not already added
      if (!document.querySelector(`link[href*="${appearance.fontFamily}"]`)) {
        document.head.appendChild(link);
      }
    }
  }, [appearance?.fontFamily, appearance?.customFontUrl]);

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

  console.log("Profile page rendering with appearance:", appearance);

  // Aplicar estilos de tema personalizados
  const themeStyles = getThemeStyles(appearance?.theme || 'light');
  const bgStyle = appearance?.backgroundStyle || "solid";
  const bgColor = appearance?.backgroundColor || (appearance?.theme === 'dark' ? '#1A1F2C' : '#ffffff');
  const customFont = appearance?.fontFamily || '';

  // Determinar o estilo de fundo com base nas configurações
  const getBackgroundStyles = () => {
    if (appearance?.backgroundImage && bgStyle === 'image') {
      return {
        backgroundImage: `url(${appearance.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
    
    if (bgStyle === 'gradient' && appearance?.gradientColors) {
      return { background: appearance.gradientColors };
    }
    
    return { backgroundColor: bgColor };
  };

  const backgroundStyles = getBackgroundStyles();
  const layoutTemplate = appearance?.layoutTemplate || 'standard';
  const layoutSettings = appearance?.layoutSettings || {};
  
  // Check display settings
  const showAvatar = layoutSettings.showAvatar !== false;
  const showBio = layoutSettings.showBio !== false;
  const compactLinks = layoutSettings.compactLinks === true;

  // Get font style based on settings
  const getFontStyle = () => {
    if (customFont === 'custom') {
      return { fontFamily: 'CustomFont, sans-serif' };
    }
    
    if (customFont && customFont !== 'default') {
      return { fontFamily: `${customFont}, sans-serif` };
    }
    
    return {};
  };

  // Render the profile based on the selected layout template
  const renderProfileContent = () => {
    switch (layoutTemplate) {
      case 'modern':
        return (
          <div className="px-4 pt-6">
            <ShareButton profile={profile} />
            
            <div className="flex flex-row items-start gap-4 mb-6 flex-wrap md:flex-nowrap">
              {showAvatar && (
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 flex-shrink-0 bg-muted" style={{borderColor: themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User size={36} />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold line-clamp-1">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
                
                {showBio && profile.bio && (
                  <p className="text-sm mb-3">{profile.bio}</p>
                )}
              </div>
            </div>
            
            <ProfileLinks 
              links={links} 
              buttonStyle={appearance?.buttonStyle || 'default'} 
              getButtonStyles={getButtonStyles} 
              buttonColor={appearance?.buttonColor || '#000000'}
              profileId={profile.id}
              compact={compactLinks}
            />
            
            {appearance?.showAnalytics && <ProfileAnalytics profileId={profile.id} />}
          </div>
        );
        
      case 'minimal':
        return (
          <div className="px-4 py-6">
            <ShareButton profile={profile} />
            
            {showAvatar && (
              <div className="mb-4 flex justify-center">
                <div className="h-20 w-20 rounded-full overflow-hidden border-2 bg-muted" style={{borderColor: themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <User size={32} />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-center mb-4">
              <span className="text-sm font-medium">@{profile.username}</span>
            </div>
            
            <ProfileLinks 
              links={links} 
              buttonStyle={appearance?.buttonStyle || 'default'} 
              getButtonStyles={getButtonStyles} 
              buttonColor={appearance?.buttonColor || '#000000'}
              profileId={profile.id}
              compact={compactLinks}
            />
            
            {appearance?.showAnalytics && <ProfileAnalytics profileId={profile.id} />}
          </div>
        );
        
      case 'creative':
        return (
          <div className="px-4 py-6 relative">
            <ShareButton profile={profile} />
            
            <div className="absolute top-0 left-0 w-full h-32 overflow-hidden opacity-10" style={{
              background: `linear-gradient(45deg, ${appearance?.buttonColor || '#000'}, transparent)`
            }}></div>
            
            <div className="relative z-10 flex flex-col items-center pt-8">
              {showAvatar && (
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 p-1 bg-muted" style={{borderColor: appearance?.buttonColor || themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full rounded-full">
                      <User size={36} />
                    </div>
                  )}
                </div>
              )}
              
              <h1 className="text-xl font-bold mt-3">
                {profile.full_name || profile.username}
              </h1>
              
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-muted/30 rounded-full text-sm mt-2">
                <span>@{profile.username}</span>
              </div>
              
              {showBio && profile.bio && (
                <p className="text-sm mt-4 text-center max-w-lg">{profile.bio}</p>
              )}
            </div>
            
            <div className="mt-8">
              <ProfileLinks 
                links={links} 
                buttonStyle={appearance?.buttonStyle || 'default'} 
                getButtonStyles={getButtonStyles} 
                buttonColor={appearance?.buttonColor || '#000000'}
                profileId={profile.id}
                compact={compactLinks}
              />
            </div>
            
            {appearance?.showAnalytics && <ProfileAnalytics profileId={profile.id} />}
          </div>
        );
      
      default: // standard
        return (
          <>
            <ShareButton profile={profile} />
            
            <ProfileHeader 
              profile={profile} 
              themeStyles={themeStyles} 
              showAvatar={showAvatar}
              showBio={showBio}
            />
            
            <ProfileLinks 
              links={links} 
              buttonStyle={appearance?.buttonStyle || 'default'} 
              getButtonStyles={getButtonStyles} 
              buttonColor={appearance?.buttonColor || '#000000'}
              profileId={profile.id}
              compact={compactLinks}
            />
            
            {appearance?.showAnalytics && <ProfileAnalytics profileId={profile.id} />}
          </>
        );
    }
  };

  return (
    <div 
      className={`min-h-screen ${themeStyles.background}`}
      style={{
        ...backgroundStyles,
        ...getFontStyle()
      }}
    >
      <ProfileCover coverUrl={profile.cover_url} />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4">
        {renderProfileContent()}
      </div>
    </div>
  );
};

export default Profile;
