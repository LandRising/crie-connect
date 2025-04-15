
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const useProfileVisit = (username?: string, profileId?: string) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Não registrar visita se o perfil não existir ou se for o próprio usuário visualizando
    if (!username || !profileId || user?.id === profileId) return;
    
    const registerVisit = async () => {
      try {
        // Registrar visita ao perfil
        await supabase.from("profile_visits").insert({
          profile_id: profileId,
          visitor_id: user?.id || null, // null para visitantes não autenticados
          visit_date: new Date().toISOString(),
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        console.error("Erro ao registrar visita:", error);
      }
    };

    registerVisit();
  }, [username, profileId, user?.id]);

  return null;
};
