import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { GripVertical, Trash, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Link = {
  id: string;
  title: string;
  url: string;
  order_position: number;
  active: boolean;
};

type LinkItemProps = {
  link: Link;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (id: string) => void;
  toggleActive: (id: string, active: boolean) => void;
};

const LinkItem = ({ link, index, moveCard, handleDelete, toggleActive }: LinkItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [, setIsDragging] = useState(false);
  
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", String(index));
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dragIndex = Number(e.dataTransfer.getData("text/plain"));
    moveCard(dragIndex, index);
  };

  const truncateUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      if (url.length <= 30) return url;
      
      return domain;
    } catch (e) {
      return url.length > 30 ? url.substring(0, 27) + "..." : url;
    }
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "flex items-center justify-between p-4 border border-gray-200 rounded-md mb-3",
        !link.active && "bg-gray-50"
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="cursor-move mr-3 text-gray-400">
          <GripVertical size={20} />
        </div>
        <div className="overflow-hidden">
          <h3 className={cn("font-medium truncate", !link.active && "text-gray-500")}>{link.title}</h3>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 flex items-center"
          >
            <span className="truncate max-w-[150px] inline-block">{truncateUrl(link.url)}</span>
            <ExternalLink size={14} className="ml-1 flex-shrink-0" />
          </a>
        </div>
      </div>
      <div className="flex items-center space-x-2 ml-2">
        <div className="flex items-center">
          <Switch
            checked={link.active}
            onCheckedChange={(checked) => toggleActive(link.id, checked)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleDelete(link.id)}
          className="flex-shrink-0"
        >
          <Trash size={16} />
        </Button>
      </div>
    </div>
  );
};

const LinkSorter = ({ links: initialLinks, onUpdate }: { links: Link[], onUpdate: () => void }) => {
  const [links, setLinks] = useState<Link[]>(initialLinks);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLinks(initialLinks);
  }, [initialLinks]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const draggedLink = links[dragIndex];
    if (!draggedLink) return;

    const newLinks = [...links];
    newLinks.splice(dragIndex, 1);
    newLinks.splice(hoverIndex, 0, draggedLink);
    
    const updatedLinks = newLinks.map((link, idx) => ({
      ...link,
      order_position: idx
    }));
    
    setLinks(updatedLinks);
    setHasChanges(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", id);
      
      if (error) throw error;
      
      onUpdate();
      toast({
        title: "Link removido com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ active })
        .eq("id", id);
      
      if (error) throw error;
      
      setLinks(links.map(link => 
        link.id === id ? { ...link, active } : link
      ));
      
      toast({
        title: active ? "Link ativado" : "Link desativado",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveOrder = async () => {
    try {
      const updates = links.map((link) => ({
        id: link.id,
        order_position: link.order_position
      }));
      
      for (const update of updates) {
        const { error } = await supabase
          .from("links")
          .update({ order_position: update.order_position })
          .eq("id", update.id);
        
        if (error) throw error;
      }
      
      setHasChanges(false);
      
      toast({
        title: "Ordem dos links salva com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar ordem dos links",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (links.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-md">
        <AlertCircle className="mx-auto mb-2 text-gray-400" size={24} />
        <p className="text-gray-500">
          Você não tem links ainda. Adicione seu primeiro link acima.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        {links.map((link, index) => (
          <LinkItem
            key={link.id}
            link={link}
            index={index}
            moveCard={moveCard}
            handleDelete={handleDelete}
            toggleActive={toggleActive}
          />
        ))}
      </div>
      
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={saveOrder}>Salvar Nova Ordem</Button>
        </div>
      )}
    </div>
  );
};

export default LinkSorter;
