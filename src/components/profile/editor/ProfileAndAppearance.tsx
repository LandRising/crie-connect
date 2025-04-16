
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { useProfileEditor } from "@/components/profile/editor/useProfileEditor";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { AppearanceSettings } from "@/types/profile";
import { Box, Layout, Palette, Type, User } from "lucide-react";

// Import Sub-Components
import ProfileInfoTab from "@/components/profile/editor/tabs/ProfileInfoTab";
import ButtonStylesTab from "@/components/profile/editor/tabs/ButtonStylesTab";
import ColorsTab from "@/components/profile/editor/tabs/ColorsTab";
import TypographyTab from "@/components/profile/editor/tabs/TypographyTab";
import LayoutSettingsTab from "@/components/profile/editor/tabs/LayoutSettingsTab";
import { ProfilePreview } from "@/components/profile/editor/ProfilePreview";

type ProfileAndAppearanceProps = {
  activeTab?: string;
  defaultPreviewVisible?: boolean;
};

const ProfileAndAppearance = ({ 
  activeTab = "profile-info",
  defaultPreviewVisible = true
}: ProfileAndAppearanceProps) => {
  const {
    profile,
    isLoading: profileLoading,
    isEditing,
    setIsEditing,
    setProfile,
    setAvatarFile,
    setCoverFile,
    fetchProfile,
    saveProfile
  } = useProfileEditor();

  const { 
    appearanceSettings, 
    isLoading: appearanceLoading,
    initialized,
    saveAppearanceSettings,
    setAppearanceSettings,
    setBackgroundFile
  } = useAppearanceSettings();

  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  const [showPreview, setShowPreview] = useState(defaultPreviewVisible);
  const [localAppearance, setLocalAppearance] = useState<AppearanceSettings | null>(null);
  
  const isLoading = profileLoading || appearanceLoading;

  // Update local state when appearance settings change
  useEffect(() => {
    if (appearanceSettings) {
      setLocalAppearance(appearanceSettings);
    }
  }, [appearanceSettings]);

  // Update local active tab when prop changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  const handleAppearanceChange = (newSettings: AppearanceSettings) => {
    setLocalAppearance(newSettings);
  };

  const handleSave = async () => {
    try {
      await saveProfile();
      
      if (localAppearance) {
        await saveAppearanceSettings(localAppearance);
      }
      
      toast({
        title: "Perfil atualizado",
        description: "Suas alterações foram salvas com sucesso",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações",
        variant: "destructive",
      });
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <ProfileInfoTab 
            profile={profile} 
            onEditClick={() => setIsEditing(true)} 
            viewMode={true}
          />
        </CardContent>
      </Card>
    );
  }

  if (!initialized || !localAppearance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando configurações...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
      <div className={`lg:col-span-${showPreview ? '3' : '5'}`}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <CardTitle>Personalize seu perfil</CardTitle>
                <CardDescription>Ajuste as informações e a aparência da sua página</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? "Ocultar Prévia" : "Mostrar Prévia"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={localActiveTab} onValueChange={setLocalActiveTab}>
              <TabsList className="mb-6 w-full overflow-auto flex-nowrap">
                <TabsTrigger value="profile-info" className="flex items-center gap-2">
                  <User size={16} /> Informações
                </TabsTrigger>
                <TabsTrigger value="button-style" className="flex items-center gap-2">
                  <Box size={16} /> Botões
                </TabsTrigger>
                <TabsTrigger value="colors" className="flex items-center gap-2">
                  <Palette size={16} /> Cores
                </TabsTrigger>
                <TabsTrigger value="typography" className="flex items-center gap-2">
                  <Type size={16} /> Tipografia
                </TabsTrigger>
                <TabsTrigger value="layout" className="flex items-center gap-2">
                  <Layout size={16} /> Layout
                </TabsTrigger>
              </TabsList>
              
              <ScrollArea className="max-h-[calc(100vh-250px)]">
                <TabsContent value="profile-info">
                  <ProfileInfoTab
                    profile={profile}
                    setProfile={setProfile}
                    setAvatarFile={setAvatarFile}
                    setCoverFile={setCoverFile}
                    onEditClick={() => {}}
                    viewMode={false}
                  />
                </TabsContent>
                
                <TabsContent value="button-style">
                  {localAppearance && (
                    <ButtonStylesTab 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="colors">
                  {localAppearance && (
                    <ColorsTab 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange}
                      setBackgroundFile={setBackgroundFile}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="typography">
                  {localAppearance && (
                    <TypographyTab 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="layout">
                  {localAppearance && (
                    <LayoutSettingsTab 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange} 
                    />
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
            
            <div className="pt-6 flex justify-between border-t mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile();
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showPreview && localAppearance && (
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prévia</CardTitle>
              <CardDescription>
                Visualize como seu perfil ficará para os visitantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePreview profile={profile} appearance={localAppearance} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProfileAndAppearance;
