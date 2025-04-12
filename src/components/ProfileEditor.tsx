
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, PenLine, Camera, ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileData = {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
};

const ProfileEditor = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    full_name: "",
    avatar_url: null,
    cover_url: null,
    bio: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, cover_url, bio")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          username: data.username || "",
          full_name: data.full_name || "",
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(reader.result as string);
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
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

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Seu Perfil</CardTitle>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
            <PenLine size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
              ) : (
                <AvatarFallback>
                  <User size={24} />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium">{profile.full_name || profile.username}</p>
              <p className="text-sm text-gray-500">@{profile.username}</p>
              {profile.bio && (
                <p className="mt-1 text-sm">{profile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Foto de Perfil</label>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-24 w-24">
                  {avatarPreview ? (
                    <AvatarImage src={avatarPreview} alt="Preview" />
                  ) : profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || profile.username} />
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
                    onChange={(e) => handleFileChange(e, 'avatar')}
                  />
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Foto de Capa</label>
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-24 w-full bg-gray-100 rounded-md overflow-hidden">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  ) : profile.cover_url ? (
                    <img src={profile.cover_url} alt="Cover" className="w-full h-full object-cover" />
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
                    onChange={(e) => handleFileChange(e, 'cover')}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Nome de Usuário
            </label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
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
                setProfile({ ...profile, full_name: e.target.value })
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
                setProfile({ ...profile, bio: e.target.value })
              }
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                fetchProfile();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEditor;
