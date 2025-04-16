
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Link2 } from "lucide-react";

type AddLinkFormProps = {
  newLink: {
    title: string;
    url: string;
  };
  onLinkChange: (link: { title: string; url: string }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

const AddLinkForm = ({ newLink, onLinkChange, onSubmit }: AddLinkFormProps) => {
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value;
    
    // Auto-add https:// if not present and not empty
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    
    onLinkChange({ ...newLink, url });
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="title" className="text-sm font-medium">
            Título do link
          </Label>
          <Input
            id="title"
            value={newLink.title}
            onChange={(e) => onLinkChange({ ...newLink, title: e.target.value })}
            placeholder="Meu Website"
            className="h-10"
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="url" className="text-sm font-medium">
            URL do link
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Link2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="url"
              value={newLink.url}
              onChange={handleUrlChange}
              placeholder="https://meusite.com"
              className="pl-10 h-10"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" className="w-full sm:w-auto">
          <Plus size={16} className="mr-2" /> Adicionar Link
        </Button>
      </div>
    </form>
  );
};

export default AddLinkForm;
