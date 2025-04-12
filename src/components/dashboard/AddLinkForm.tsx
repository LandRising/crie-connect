
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type AddLinkFormProps = {
  newLink: {
    title: string;
    url: string;
  };
  onLinkChange: (link: { title: string; url: string }) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

const AddLinkForm = ({ newLink, onLinkChange, onSubmit }: AddLinkFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar novo link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título
            </label>
            <Input
              id="title"
              value={newLink.title}
              onChange={(e) => onLinkChange({ ...newLink, title: e.target.value })}
              placeholder="Ex: Meu Website"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              URL
            </label>
            <Input
              id="url"
              value={newLink.url}
              onChange={(e) => onLinkChange({ ...newLink, url: e.target.value })}
              placeholder="Ex: https://meusite.com"
            />
          </div>
          <Button type="submit" className="w-full">
            <Plus size={16} className="mr-2" /> Adicionar Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLinkForm;
