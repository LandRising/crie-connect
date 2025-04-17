
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
import { Box, Layout, Palette, Type, User, Eye, EyeOff } from "lucide-react";

// Import Sub-Components
import ProfileInfoTab from "@/components/profile/editor/tabs/ProfileInfoTab";
import ButtonStylesTab from "@/components/profile/editor/tabs/ButtonStylesTab";
import ColorsTab from "@/components/profile/editor/tabs/ColorsTab";
import TypographyTab from "@/components/profile/editor/tabs/TypographyTab";
import LayoutSettingsTab from "@/components/profile/editor/tabs/LayoutSettingsTab";
import { ProfilePreview } from "@/components/profile/editor/ProfilePreview";
import { useIsMobile } from "@/hooks/use-mobile";

type ProfileAndAppearanceProps = {
  activeTab?: string;
  defaultPreviewVisible?: boolean;
  isCompact?: boolean;
};

const ProfileAndAppearance = ({ 
  activeTab = "profile-info",
  defaultPreviewVisible = true,
  isCompact = false
}: ProfileAndAppearanceProps) => {
  const isMobile = useIsMobile();
  
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
      <div className="space-y-4">
        <ProfileInfoTab 
          profile={profile} 
          onEditClick={() => setIsEditing(true)} 
          viewMode={true}
        />
      </div>
    );
  }

  if (!initialized || !localAppearance) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-12 w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${isCompact ? "max-w-3xl mx-auto" : ""}`}>
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold">Personalize seu perfil</h2>
          <p className="text-sm text-muted-foreground">
            Ajuste as informações e a aparência da sua página
          </p>
        </div>
        
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1.5"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff size={16} />
                <span className="hidden sm:inline">Ocultar Prévia</span>
              </>
            ) : (
              <>
                <Eye size={16} />
                <span className="hidden sm:inline">Mostrar Prévia</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className={`grid ${showPreview && !isMobile ? "grid-cols-1 lg:grid-cols-5 gap-4" : "grid-cols-1"}`}>
        <div className={`${showPreview && !isMobile ? "lg:col-span-3" : ""}`}>
          <Card className="border-0 shadow-none lg:border lg:shadow-sm">
            <CardContent className="p-0 sm:p-6">
              <Tabs value={localActiveTab} onValueChange={setLocalActiveTab} className="w-full">
                <TabsList className="w-full overflow-x-auto flex-nowrap justify-start mb-6 p-1">
                  <TabsTrigger value="profile-info" className="flex items-center gap-1.5 whitespace-nowrap">
                    <User size={16} /> 
                    <span>Informações</span>
                  </TabsTrigger>
                  <TabsTrigger value="button-style" className="flex items-center gap-1.5 whitespace-nowrap">
                    <Box size={16} /> 
                    <span>Botões</span>
                  </TabsTrigger>
                  <TabsTrigger value="colors" className="flex items-center gap-1.5 whitespace-nowrap">
                    <Palette size={16} /> 
                    <span>Cores</span>
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex items-center gap-1.5 whitespace-nowrap">
                    <Type size={16} /> 
                    <span>Tipografia</span>
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-1.5 whitespace-nowrap">
                    <Layout size={16} /> 
                    <span>Layout</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="px-4 sm:px-0">
                  <ScrollArea className="max-h-[calc(100vh-280px)]">
                    <TabsContent value="profile-info" className="m-0">
                      <ProfileInfoTab
                        profile={profile}
                        setProfile={setProfile}
                        setAvatarFile={setAvatarFile}
                        setCoverFile={setCoverFile}
                        onEditClick={() => {}}
                        viewMode={false}
                      />
                    </TabsContent>
                    
                    <TabsContent value="button-style" className="m-0">
                      {localAppearance && (
                        <ButtonStylesTab 
                          settings={localAppearance} 
                          onSettingsChange={handleAppearanceChange} 
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="colors" className="m-0">
                      {localAppearance && (
                        <ColorsTab 
                          settings={localAppearance} 
                          onSettingsChange={handleAppearanceChange}
                          setBackgroundFile={setBackgroundFile}
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="typography" className="m-0">
                      {localAppearance && (
                        <TypographyTab 
                          settings={localAppearance} 
                          onSettingsChange={handleAppearanceChange} 
                        />
                      )}
                    </TabsContent>
                    
                    <TabsContent value="layout" className="m-0">
                      {localAppearance && (
                        <LayoutSettingsTab 
                          settings={localAppearance} 
                          onSettingsChange={handleAppearanceChange} 
                        />
                      )}
                    </TabsContent>
                  </ScrollArea>
                  
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
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {showPreview && !isMobile && localAppearance && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prévia</CardTitle>
                <CardDescription>
                  Visualize como seu perfil ficará para os visitantes
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-6">
                <ProfilePreview profile={profile} appearance={localAppearance} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {isMobile && showPreview && localAppearance && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Prévia do Perfil</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                <EyeOff size={16} className="mr-2" /> Ocultar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProfilePreview profile={profile} appearance={localAppearance} />
          </CardContent>
        </Card>
      )}
      
      {isMobile && !showPreview && (
        <Button 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => setShowPreview(true)}
        >
          <Eye size={16} className="mr-2" /> Visualizar Prévia
        </Button>
      )}
    </div>
  );
};

export default ProfileAndAppearance;
