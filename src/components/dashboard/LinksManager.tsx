
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import AddLinkForm from "./AddLinkForm";
import LinkSorter from "@/components/LinkSorter";
import { useLinks } from "@/hooks/useLinks";

const LinksManager = () => {
  const { user } = useAuth();
  const { links, newLink, setNewLink, fetchLinks, addLink } = useLinks(user?.id);
  
  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="space-y-6">
      <AddLinkForm
        newLink={newLink}
        onLinkChange={setNewLink}
        onSubmit={addLink}
      />
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Seus Links</h2>
        <LinkSorter links={links} onUpdate={fetchLinks} />
      </div>
    </div>
  );
};

export default LinksManager;
