
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Camera } from "lucide-react";

type ProfileImageUploadProps = {
  initialUrl: string | null;
  onFileChange: (file: File) => void;
};

export const ProfileImageUpload = ({
  initialUrl,
  onFileChange,
}: ProfileImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onFileChange(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Foto de Perfil</label>
      <div className="flex flex-col items-center gap-2">
        <Avatar className="h-24 w-24">
          {preview ? (
            <AvatarImage src={preview} alt="Preview" />
          ) : initialUrl ? (
            <AvatarImage src={initialUrl} alt="Avatar" />
          ) : (
            <AvatarFallback>
              <User size={32} />
            </AvatarFallback>
          )}
        </Avatar>
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Button type="button" variant="outline" size="sm" asChild>
            <span>
              <Camera size={14} className="mr-1" /> Alterar
            </span>
          </Button>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};
