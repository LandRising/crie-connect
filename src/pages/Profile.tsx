
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { ProfileCover } from "@/components/profile/ProfileCover";
import { useProfileData } from "@/hooks/useProfileData";
import InstallPWA from "@/components/pwa/InstallPWA";
import { getButtonStyles } from "@/utils/profileStyles";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { profile, links, loading, error, appearance } = useProfileData(username || "");

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Perfil não encontrado</div>
      </div>
    );
  }

  const themeStyles = {
    text: appearance.theme === 'dark' ? 'text-white' : 'text-gray-900',
    subtext: appearance.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
  };

  return (
    <div className="min-h-screen-safe bg-background">
      <ProfileCover coverUrl={profile.cover_url} />
      
      <div className="relative z-10 mx-auto max-w-3xl px-4 pb-20 pt-4">
        <ProfileHeader profile={profile} themeStyles={themeStyles} />
        <ProfileLinks 
          links={links} 
          buttonStyle={appearance.buttonStyle} 
          getButtonStyles={getButtonStyles} 
        />
        
        {/* Botão de instalação PWA */}
        <div className="fixed bottom-6 right-6 z-50">
          <InstallPWA />
        </div>
      </div>
    </div>
  );
};

export default Profile;
