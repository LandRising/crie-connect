
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, PenLine } from "lucide-react";

type ProfileData = {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
};

const ProfileEditor = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    username: "",
    full_name: "",
    avatar_url: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          username: data.username || "",
          full_name: data.full_name || "",
          avatar_url: data.avatar_url,
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

  // Save profile changes
  const saveProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
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
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      
      toast({
        title: "Perfil atualizado com sucesso",
      });
      
      setIsEditing(false);
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
  useState(() => {
    fetchProfile();
  });

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
            <div className="bg-gray-200 rounded-full p-3">
              <User size={24} />
            </div>
            <div>
              <p className="font-medium">{profile.full_name || profile.username}</p>
              <p className="text-sm text-gray-500">@{profile.username}</p>
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
