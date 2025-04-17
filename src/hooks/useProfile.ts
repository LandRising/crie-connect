
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const useProfile = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(null);
  const profileId = user?.id || null;

  const fetchProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, cover_url, bio")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      setUsername(data.username);
      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    username,
    profile,
    profileId,
    fetchProfile
  };
};
