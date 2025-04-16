
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { ProfileFormView } from "@/components/profile/editor/ProfileFormView";
import { ProfileForm } from "@/components/profile/editor/ProfileForm";
import { ProfileImageUpload } from "@/components/profile/editor/ProfileImageUpload";
import { CoverImageUpload } from "@/components/profile/editor/CoverImageUpload";
import { BackgroundUpload } from "@/components/profile/editor/BackgroundUpload";
import { ProfilePreview } from "@/components/profile/editor/ProfilePreview";
import { useProfileEditor } from "@/components/profile/editor/useProfileEditor";
import { useAppearanceSettings } from "@/hooks/useAppearanceSettings";
import { AppearanceSettings } from "@/types/profile";

// Import Appearance Settings Components
import AppearanceButtonStyles from "@/components/profile/editor/appearance/ButtonStyles";
import AppearanceColorSettings from "@/components/profile/editor/appearance/ColorSettings";
import AppearanceTypography from "@/components/profile/editor/appearance/Typography";
import AppearanceLayout from "@/components/profile/editor/appearance/LayoutSettings";

import { Box, Layout, Palette, Type, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileAndAppearance = () => {
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

  const [activeTab, setActiveTab] = useState("profile-info");
  const [showPreview, setShowPreview] = useState(false);
  const [localAppearance, setLocalAppearance] = useState<AppearanceSettings | null>(null);
  
  const isLoading = profileLoading || appearanceLoading;

  // Update local state when appearance settings change
  useEffect(() => {
    if (appearanceSettings) {
      setLocalAppearance(appearanceSettings);
    }
  }, [appearanceSettings]);

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
          <ProfileFormView 
            profile={profile} 
            onEditClick={() => setIsEditing(true)} 
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className={`lg:col-span-${showPreview ? '3' : '5'}`}>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Editar Perfil</CardTitle>
                <CardDescription>Personalize seu perfil e aparência</CardDescription>
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 w-full">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <ProfileImageUpload
                      initialUrl={profile.avatar_url}
                      onFileChange={(file) => setAvatarFile(file)}
                    />
                    
                    <CoverImageUpload
                      initialUrl={profile.cover_url}
                      onFileChange={(file) => setCoverFile(file)}
                    />
                  </div>
                  
                  <ProfileForm
                    profile={profile}
                    onProfileChange={setProfile}
                    onCancel={() => {
                      setIsEditing(false);
                      fetchProfile();
                    }}
                    onSubmit={handleSave}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="button-style">
                  {localAppearance && (
                    <AppearanceButtonStyles 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="colors">
                  {localAppearance && (
                    <div className="space-y-6">
                      <AppearanceColorSettings 
                        settings={localAppearance} 
                        onSettingsChange={handleAppearanceChange} 
                      />
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Imagem de fundo</h3>
                        <BackgroundUpload
                          initialUrl={localAppearance.backgroundImage || null}
                          onFileChange={setBackgroundFile}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="typography">
                  {localAppearance && (
                    <AppearanceTypography 
                      settings={localAppearance} 
                      onSettingsChange={handleAppearanceChange} 
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="layout">
                  {localAppearance && (
                    <AppearanceLayout 
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
