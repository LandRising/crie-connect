
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/types/profile";

type ProfileFormProps = {
  profile: ProfileData;
  onProfileChange: (updatedProfile: ProfileData) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export const ProfileForm = ({
  profile,
  onProfileChange,
  onCancel,
  onSubmit,
  isLoading,
}: ProfileFormProps) => {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Nome de Usuário
        </label>
        <Input
          id="username"
          value={profile.username}
          onChange={(e) =>
            onProfileChange({ ...profile, username: e.target.value })
          }
          placeholder="seu_usuario"
          required
        />
        <p className="text-xs text-gray-500">
          Esta será sua URL: linksplash.com/{profile.username}
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm font-medium">
          Nome Completo
        </label>
        <Input
          id="full_name"
          value={profile.full_name || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, full_name: e.target.value })
          }
          placeholder="Seu Nome Completo"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          value={profile.bio || ""}
          onChange={(e) =>
            onProfileChange({ ...profile, bio: e.target.value })
          }
          placeholder="Conte um pouco sobre você..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  );
};
