
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/types/profile";
import { PenLine } from "lucide-react";

type ProfileFormViewProps = {
  profile: ProfileData;
  onEditClick: () => void;
};

export const ProfileFormView = ({ profile, onEditClick }: ProfileFormViewProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Seu Perfil</h3>
        <Button variant="outline" size="icon" onClick={onEditClick}>
          <PenLine size={16} />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
          ) : (
            <AvatarFallback>
              <User size={24} />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{profile.full_name || profile.username}</p>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          {profile.bio && (
            <p className="mt-1 text-sm">{profile.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};
