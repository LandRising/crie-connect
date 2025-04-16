
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLinks } from "@/hooks/useLinks";
import { Card, CardContent } from "@/components/ui/card";
import AddLinkForm from "./AddLinkForm";
import LinkSorter from "@/components/LinkSorter";
import DashboardHeader from "./DashboardHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link2, ExternalLink } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const LinksManager = () => {
  const { user } = useAuth();
  const { username } = useProfile();
  const { links, newLink, setNewLink, fetchLinks, addLink } = useLinks(user?.id);
  const [showAddForm, setShowAddForm] = useState(false);
  
  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault();
    await addLink(e);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Meus Links" 
        description="Gerencie seus links para compartilhar com seus seguidores"
        actions={
          <Button 
            variant={showAddForm ? "outline" : "default"}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm 
              ? "Cancelar" 
              : <>
                  <PlusCircle size={16} className="mr-2" />
                  Novo Link
                </>
            }
          </Button>
        }
      />
      
      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <AddLinkForm
              newLink={newLink}
              onLinkChange={setNewLink}
              onSubmit={handleSubmitLink}
            />
          </CardContent>
        </Card>
      )}
      
      {links.length === 0 && !showAddForm ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Link2 size={40} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Você ainda não tem links</h3>
            <p className="text-muted-foreground mb-4">
              Adicione seu primeiro link para compartilhar com seus seguidores.
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="mx-auto"
            >
              <PlusCircle size={16} className="mr-2" />
              Adicionar primeiro link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {links.length > 0 && (
            <div className="bg-card rounded-lg border p-1">
              <LinkSorter links={links} onUpdate={fetchLinks} />
              
              {username && (
                <div className="p-4 mt-4 border-t flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`/${username}`, '_blank')}
                    className="w-full max-w-sm"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Ver minha página
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LinksManager;
