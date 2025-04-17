
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useLinks } from "@/hooks/useLinks";
import { Card, CardContent } from "@/components/ui/card";
import AddLinkForm from "./AddLinkForm";
import LinkSorter from "@/components/LinkSorter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Link2, ExternalLink, X } from "lucide-react";
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Meus Links</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus links para compartilhar com seus seguidores
          </p>
        </div>
        <Button 
          variant={showAddForm ? "outline" : "default"}
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5"
        >
          {showAddForm ? (
            <>
              <X size={16} />
              <span className="hidden sm:inline">Cancelar</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span className="hidden sm:inline">Novo Link</span>
            </>
          )}
        </Button>
      </div>
      
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
                    className="w-full max-w-sm flex items-center gap-1.5"
                  >
                    <ExternalLink size={16} />
                    <span>Ver minha página</span>
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
