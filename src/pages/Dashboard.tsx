
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ExternalLink } from "lucide-react";
import ProfileEditor from "@/components/ProfileEditor";
import LinkSorter from "@/components/LinkSorter";
import AppearanceSettings, { AppearanceSettings as AppearanceSettingsType, ButtonStyle, ThemeType } from "@/components/AppearanceSettings";

type Link = {
  id: string;
  title: string;
  url: string;
  order_position: number;
  active: boolean;
};

interface AppearanceSettingsData {
  id: string;
  user_id: string;
  button_style: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [links, setLinks] = useState<Link[]>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("links");
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettingsType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchLinks();
    fetchProfile();
    fetchAppearanceSettings();
  }, [user, navigate]);

  const fetchLinks = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
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

  const fetchProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      setUsername(data.username);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAppearanceSettings = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("appearance_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Erro ao buscar configurações de aparência:', error);
        return;
      }
      
      if (data) {
        setAppearanceSettings({
          buttonStyle: data.button_style as ButtonStyle || "default",
          theme: data.theme as ThemeType || "light"
        });
      }
    } catch (error: any) {
      console.error('Erro ao buscar configurações de aparência:', error);
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
        user_id: user?.id,
        title: newLink.title,
        url: newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`,
        order_position: nextPosition,
      });
      
      if (error) throw error;
      
      setNewLink({ title: "", url: "" });
      fetchLinks();
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const saveAppearanceSettings = async (settings: AppearanceSettingsType) => {
    setAppearanceSettings(settings);
    fetchAppearanceSettings(); // Refresh settings after save
  };

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">CRIEConnect</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/${username}`)}>
            Visualizar página
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            Sair
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
        </TabsList>
        
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar novo link</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addLink} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Título
                  </label>
                  <Input
                    id="title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
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
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="Ex: https://meusite.com"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus size={16} className="mr-2" /> Adicionar Link
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Seus Links</h2>
            <LinkSorter links={links} onUpdate={fetchLinks} />
          </div>
        </TabsContent>
        
        <TabsContent value="profile">
          <ProfileEditor />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSettings 
            initialSettings={appearanceSettings || undefined} 
            onSave={saveAppearanceSettings} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
