
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ProfileData } from "@/types/profile";

export interface ProfileEditorState {
  profile: ProfileData;
  isLoading: boolean;
  isEditing: boolean;
  avatarFile: File | null;
  coverFile: File | null;
  setIsEditing: (value: boolean) => void;
  setProfile: (profile: ProfileData) => void;
  setAvatarFile: (file: File | null) => void;
  setCoverFile: (file: File | null) => void;
  fetchProfile: () => Promise<void>;
  saveProfile: () => Promise<void>;
}

export const useProfileEditor = (): ProfileEditorState => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    username: "",
    full_name: null,
    avatar_url: null,
    cover_url: null,
    bio: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, cover_url, bio")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          id: data.id,
          username: data.username || "",
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          cover_url: data.cover_url,
          bio: data.bio,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Upload file to Supabase Storage
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    if (!user) return null;
    
    const fileName = `${user.id}-${Date.now()}`;
    const filePath = `${path}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(filePath, file);
      
    if (error) {
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from("profiles")
      .getPublicUrl(filePath);
      
    return publicUrl;
  };

  // Save profile changes
  const saveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let avatarUrl = profile.avatar_url;
      let coverUrl = profile.cover_url;
      
      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, 'avatars');
      }
      
      // Upload cover if changed
      if (coverFile) {
        coverUrl = await uploadFile(coverFile, 'covers');
      }
      
      // Check if username is already taken (if changed)
      if (profile.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", profile.username.toLowerCase())
          .neq("id", user.id)
          .maybeSingle();

        if (checkError) throw checkError;
        
        if (existingUser) {
          toast({
            title: "Nome de usuário já existe",
            description: "Por favor escolha outro nome de usuário",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username.toLowerCase(),
          full_name: profile.full_name,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          bio: profile.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Perfil atualizado com sucesso",
      });
      
      setIsEditing(false);
      setAvatarFile(null);
      setCoverFile(null);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile when component mounts or user changes
  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    isLoading,
    isEditing,
    avatarFile,
    coverFile,
    setIsEditing,
    setProfile,
    setAvatarFile,
    setCoverFile,
    fetchProfile,
    saveProfile
  };
};
