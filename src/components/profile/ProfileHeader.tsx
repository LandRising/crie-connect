
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileData } from "@/types/profile";

type ProfileHeaderProps = {
  profile: ProfileData;
  themeStyles: {
    text: string;
    subtext: string;
  };
};

export const ProfileHeader = ({ profile, themeStyles }: ProfileHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <Avatar className="h-24 w-24 mx-auto mb-4">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
        ) : (
          <AvatarFallback className="bg-gray-200 text-gray-700">
            <User size={32} />
          </AvatarFallback>
        )}
      </Avatar>
      <h1 className={cn("text-2xl font-bold", themeStyles.text)}>
        {profile.full_name || profile.username}
      </h1>
      <p className={cn(themeStyles.subtext)}>@{profile.username}</p>
      
      {profile.bio && (
        <p className={cn("mt-3 text-sm max-w-md mx-auto", themeStyles.text)}>
          {profile.bio}
        </p>
      )}
    </div>
  );
};
