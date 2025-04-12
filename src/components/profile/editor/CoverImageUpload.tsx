
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";

type CoverImageUploadProps = {
  initialUrl: string | null;
  onFileChange: (file: File) => void;
};

export const CoverImageUpload = ({
  initialUrl,
  onFileChange,
}: CoverImageUploadProps) => {
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
      <label className="text-sm font-medium">Foto de Capa</label>
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-24 w-full bg-gray-100 rounded-md overflow-hidden">
          {preview ? (
            <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
          ) : initialUrl ? (
            <img src={initialUrl} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <ImageIcon size={32} className="text-gray-400" />
            </div>
          )}
        </div>
        <label htmlFor="cover-upload" className="cursor-pointer">
          <Button type="button" variant="outline" size="sm" asChild>
            <span>
              <ImageIcon size={14} className="mr-1" /> Alterar
            </span>
          </Button>
          <input
            id="cover-upload"
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
