
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type BackgroundUploadProps = {
  initialUrl: string | null;
  onFileChange: (file: File | null) => void;
}

export const BackgroundUpload = ({ initialUrl, onFileChange }: BackgroundUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem",
        variant: "destructive"
      });
      return;
    }
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onFileChange(file);
  };

  const removeBackground = () => {
    setPreviewUrl(null);
    onFileChange(null);
  };

  return (
    <div className="space-y-3">
      <div 
        className="border rounded-lg aspect-video relative bg-muted overflow-hidden cursor-pointer"
        onClick={() => document.getElementById('background-upload')?.click()}
      >
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Background Preview" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Imagem de fundo</p>
              <p className="text-xs text-muted-foreground">Clique para fazer upload</p>
            </div>
          </div>
        )}
      </div>
      
      <input
        id="background-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {previewUrl && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={removeBackground}
          className="w-full"
        >
          Remover imagem
        </Button>
      )}
    </div>
  );
};
