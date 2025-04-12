
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type Link = {
  id: string;
  title: string;
  url: string;
  order_position: number;
  active: boolean;
};

export const useLinks = (userId: string | undefined) => {
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  
  const fetchLinks = async () => {
    try {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("order_position");
      
      if (error) throw error;
      setLinks(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar links",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Erro",
        description: "Título e URL são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      const nextPosition = links.length;
      
      const { error } = await supabase.from("links").insert({
        user_id: userId,
        title: newLink.title,
        url: newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`,
        order_position: nextPosition,
      });
      
      if (error) throw error;
      
      setNewLink({ title: "", url: "" });
      await fetchLinks();
      toast({
        title: "Link adicionado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    links,
    newLink,
    setNewLink,
    fetchLinks,
    addLink
  };
};
