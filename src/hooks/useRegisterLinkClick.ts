
import { supabase } from "@/integrations/supabase/client";

export const registerLinkClick = async (linkId: string, profileId: string) => {
  try {
    await supabase.from("link_clicks").insert({
      link_id: linkId,
      profile_id: profileId,
      click_date: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro ao registrar clique:", error);
  }
};
