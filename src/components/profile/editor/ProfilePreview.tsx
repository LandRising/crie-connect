
import React from 'react';
import { ProfileData, AppearanceSettings } from '@/types/profile';
import { getThemeStyles, getButtonStyles } from '@/utils/profileStyles';
import { User, Link as LinkIcon } from 'lucide-react';

type ProfilePreviewProps = {
  profile: ProfileData;
  appearance: AppearanceSettings;
}

export const ProfilePreview = ({ profile, appearance }: ProfilePreviewProps) => {
  const themeStyles = getThemeStyles(appearance.theme);
  
  const getBackgroundStyle = () => {
    // Handle image background
    if (appearance.backgroundImage && appearance.backgroundStyle === 'image') {
      return {
        backgroundImage: `url(${appearance.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Handle gradient background
    if (appearance.backgroundStyle === 'gradient' && appearance.gradientColors) {
      return { background: appearance.gradientColors };
    }
    
    // Default to solid color
    return { backgroundColor: appearance.backgroundColor || '#ffffff' };
  };

  const getFontStyle = () => {
    if (appearance.fontFamily === 'custom') {
      return { fontFamily: 'CustomFont, sans-serif' };
    }
    
    if (appearance.fontFamily && appearance.fontFamily !== 'default') {
      return { fontFamily: `${appearance.fontFamily}, sans-serif` };
    }
    
    return {};
  };

  // Custom color style for buttons
  const getCustomButtonStyle = () => {
    const buttonColor = appearance.buttonColor || '#000000';
    
    if (appearance.buttonStyle === 'outline') {
      return {
        backgroundColor: 'transparent',
        color: buttonColor,
        borderColor: buttonColor,
        border: '2px solid'
      };
    }

    let buttonStyles: React.CSSProperties = {
      backgroundColor: buttonColor,
      color: '#ffffff'
    };

    switch (appearance.buttonStyle) {
      case 'rounded':
        buttonStyles.borderRadius = '9999px';
        break;
      case 'shadow':
        buttonStyles.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        break;
      case 'glass':
        buttonStyles.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        buttonStyles.backdropFilter = 'blur(8px)';
        buttonStyles.border = '1px solid rgba(255, 255, 255, 0.3)';
        break;
      case 'soft':
        buttonStyles.borderRadius = '12px';
        break;
      default:
        buttonStyles.borderRadius = '6px';
    }
    
    return buttonStyles;
  };
  
  // Layout settings
  const layoutSettings = appearance.layoutSettings || {};
  const showAvatar = layoutSettings.showAvatar !== false;
  const showBio = layoutSettings.showBio !== false;
  const compactLinks = layoutSettings.compactLinks === true;
  const layoutTemplate = appearance.layoutTemplate || 'standard';

  // Render different layouts based on the template
  const renderLayout = () => {
    switch (layoutTemplate) {
      case 'modern':
        return (
          <div className="px-4 pt-6 pb-6">
            <div className="flex flex-row items-center gap-4 mb-6">
              {showAvatar && (
                <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0 border-2" style={{borderColor: themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center text-xl">
                      <User size={24} />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-col">
                <h2 className="font-bold text-base">
                  {profile.full_name || profile.username}
                </h2>
                <p className="text-xs opacity-70">@{profile.username}</p>
                
                {showBio && profile.bio && (
                  <p className="text-xs mt-1">{profile.bio}</p>
                )}
              </div>
            </div>
            
            {renderLinks()}
          </div>
        );
        
      case 'minimal':
        return (
          <div className="px-4 py-6">
            {showAvatar && (
              <div className="mb-4 flex justify-center">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2" style={{borderColor: themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center text-xl">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="text-center mb-4">
              <span className="text-sm font-medium">@{profile.username}</span>
            </div>
            
            {renderLinks()}
          </div>
        );
        
      case 'creative':
        return (
          <div className="px-4 py-6 relative">
            <div className="absolute top-0 left-0 w-full h-20 overflow-hidden opacity-10" style={{
              background: `linear-gradient(45deg, ${appearance.buttonColor || '#000'}, transparent)`
            }}></div>
            
            <div className="relative z-10 flex flex-col items-center pt-6">
              {showAvatar && (
                <div className="h-20 w-20 rounded-full overflow-hidden border-4 p-1 bg-background" style={{borderColor: appearance.buttonColor || themeStyles.border}}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <div className="bg-muted w-full h-full flex items-center justify-center text-2xl rounded-full">
                      <User size={32} />
                    </div>
                  )}
                </div>
              )}
              
              <h2 className="font-bold text-lg mt-2">
                {profile.full_name || profile.username}
              </h2>
              
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted/30 rounded-full text-xs mt-1">
                <span>@{profile.username}</span>
              </div>
              
              {showBio && profile.bio && (
                <p className="text-sm mt-3 text-center max-w-[250px]">{profile.bio}</p>
              )}
            </div>
            
            <div className="mt-6">
              {renderLinks()}
            </div>
          </div>
        );
      
      default: // standard
        return (
          <div className="px-4 pt-12 pb-6 flex flex-col items-center">
            {showAvatar && (
              <div className="absolute -top-10 h-20 w-20 rounded-full border-4 overflow-hidden" style={{borderColor: themeStyles.background}}>
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="bg-muted w-full h-full flex items-center justify-center text-2xl">
                    {profile.username?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </div>
            )}
            
            <h2 className="font-bold text-lg mt-2">
              {profile.full_name || profile.username}
            </h2>
            <p className="text-sm opacity-70">@{profile.username}</p>
            
            {showBio && profile.bio && (
              <p className="text-sm mt-3 text-center max-w-[250px]">{profile.bio}</p>
            )}
            
            <div className="mt-6 w-full">
              {renderLinks()}
            </div>
          </div>
        );
    }
  };
  
  // Render links based on the button style and layout settings
  const renderLinks = () => {
    const buttonStyle = getCustomButtonStyle();
    const linkClass = compactLinks ? "py-1.5 px-3 mb-2" : "py-2.5 px-4 mb-3";
    
    return (
      <div className="w-full space-y-2 max-w-[280px] mx-auto">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`${linkClass} w-full text-center cursor-pointer flex items-center justify-center gap-2`}
            style={buttonStyle}
          >
            <LinkIcon size={16} />
            <span>Link de Exemplo {i}</span>
          </div>
        ))}
      </div>
    );
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
          
          {/* Profile content with different layouts */}
          <div className="relative">
            {renderLayout()}
          </div>
        </div>
      </div>
    </div>
  );
};
