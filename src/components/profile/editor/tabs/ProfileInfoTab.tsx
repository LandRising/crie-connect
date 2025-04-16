
import { ProfileData } from "@/types/profile";
import { ProfileForm } from "@/components/profile/editor/ProfileForm";
import { ProfileFormView } from "@/components/profile/editor/ProfileFormView";
import { ProfileImageUpload } from "@/components/profile/editor/ProfileImageUpload";
import { CoverImageUpload } from "@/components/profile/editor/CoverImageUpload";

type ProfileInfoTabProps = {
  profile: ProfileData;
  setProfile?: (profile: ProfileData) => void;
  setAvatarFile?: (file: File | null) => void;
  setCoverFile?: (file: File | null) => void;
  onEditClick: () => void;
  viewMode: boolean;
};

const ProfileInfoTab = ({
  profile,
  setProfile,
  setAvatarFile,
  setCoverFile,
  onEditClick,
  viewMode
}: ProfileInfoTabProps) => {
  if (viewMode) {
    return (
      <ProfileFormView 
        profile={profile} 
        onEditClick={onEditClick} 
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProfileImageUpload
          initialUrl={profile.avatar_url}
          onFileChange={(file) => setAvatarFile && setAvatarFile(file)}
        />
        
        <CoverImageUpload
          initialUrl={profile.cover_url}
          onFileChange={(file) => setCoverFile && setCoverFile(file)}
        />
      </div>
      
      <ProfileForm
        profile={profile}
        onProfileChange={(profile) => setProfile && setProfile(profile)}
        onCancel={onEditClick}
        onSubmit={() => {}} // Handled by parent component
        isLoading={false}
      />
    </>
  );
};

export default ProfileInfoTab;
