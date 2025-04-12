
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileFormView } from "@/components/profile/editor/ProfileFormView";
import { ProfileForm } from "@/components/profile/editor/ProfileForm";
import { ProfileImageUpload } from "@/components/profile/editor/ProfileImageUpload";
import { CoverImageUpload } from "@/components/profile/editor/CoverImageUpload";
import { useProfileEditor } from "@/components/profile/editor/useProfileEditor";

const ProfileEditor = () => {
  const {
    profile,
    isLoading,
    isEditing,
    setIsEditing,
    setProfile,
    setAvatarFile,
    setCoverFile,
    fetchProfile,
    saveProfile
  } = useProfileEditor();

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <ProfileFormView 
            profile={profile} 
            onEditClick={() => setIsEditing(true)} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <ProfileImageUpload 
            initialUrl={profile.avatar_url} 
            onFileChange={(file) => setAvatarFile(file)} 
          />
          
          <CoverImageUpload 
            initialUrl={profile.cover_url} 
            onFileChange={(file) => setCoverFile(file)} 
          />
        </div>
        
        <ProfileForm 
          profile={profile}
          onProfileChange={setProfile}
          onCancel={() => {
            setIsEditing(false);
            fetchProfile();
          }}
          onSubmit={saveProfile}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
