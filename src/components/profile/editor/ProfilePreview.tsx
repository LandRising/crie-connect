
import React from 'react';
import { ProfileData, AppearanceSettings } from '@/types/profile';
import { getThemeStyles, getButtonStyles } from '@/utils/profileStyles';

type ProfilePreviewProps = {
  profile: ProfileData;
  appearance: AppearanceSettings;
}

export const ProfilePreview = ({ profile, appearance }: ProfilePreviewProps) => {
  const themeStyles = getThemeStyles(appearance.theme);
  const buttonStyle = getButtonStyles(appearance.buttonStyle);
  
  const getBackgroundStyle = () => {
    if (appearance.backgroundImage) {
      return {
        backgroundImage: `url(${appearance.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    if (appearance.backgroundStyle === 'gradient' && appearance.gradientColors) {
      return { background: appearance.gradientColors };
    }
    
    return { backgroundColor: appearance.backgroundColor || '#ffffff' };
  };

  const getFontStyle = () => {
    if (appearance.customFontUrl) {
      return { fontFamily: 'CustomFont, sans-serif' };
    }
    
    if (appearance.fontFamily && appearance.fontFamily !== 'default') {
      return { fontFamily: `${appearance.fontFamily}, sans-serif` };
    }
    
    return {};
  };

  // Custom color style for buttons
  const getCustomButtonStyle = () => {
    const baseStyle = buttonStyle;
    
    if (appearance.buttonColor) {
      const customColor = { 
        backgroundColor: appearance.buttonStyle === 'outline' ? 'transparent' : appearance.buttonColor,
        color: appearance.buttonStyle === 'outline' ? appearance.buttonColor : '#ffffff',
        borderColor: appearance.buttonColor
      };
      return customColor;
    }
    
    return {};
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md w-full h-[500px] flex flex-col">
      {/* Preview header */}
      <div className="bg-muted p-3 border-b flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-red-500"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
        <div className="ml-4 text-xs text-center flex-1">Visualização do Perfil</div>
      </div>
      
      {/* Preview content */}
      <div className="flex-1 overflow-hidden">
        <div 
          className="h-full overflow-y-auto" 
          style={{
            ...getBackgroundStyle(),
            ...getFontStyle(),
            color: themeStyles.text
          }}
        >
          {/* Cover image */}
          <div 
            className="h-28 relative"
            style={profile.cover_url ? { backgroundImage: `url(${profile.cover_url})`, backgroundSize: 'cover' } : {}}
          />
          
          {/* Profile content */}
          <div className="px-4 pt-12 pb-6 flex flex-col items-center relative">
            {/* Avatar */}
            <div 
              className="absolute -top-10 h-20 w-20 rounded-full border-4 border-background overflow-hidden"
              style={{borderColor: themeStyles.background}}
            >
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="bg-muted w-full h-full flex items-center justify-center text-2xl">
                  {profile.username?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            
            {/* User info */}
            <h2 className="font-bold text-lg mt-2">
              {profile.full_name || profile.username}
            </h2>
            <p className="text-sm opacity-70">@{profile.username}</p>
            
            {profile.bio && (
              <p className="text-sm mt-3 text-center max-w-[250px]">{profile.bio}</p>
            )}
            
            {/* Example links */}
            <div className="mt-6 w-full space-y-3 max-w-[280px]">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="py-2.5 px-4 w-full text-center rounded-md cursor-pointer"
                  style={getCustomButtonStyle()}
                >
                  Link de Exemplo {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
