
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";

export const useProfileVisit = (username?: string, profileId?: string) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Don't register visit if the profile doesn't exist or if it's the user viewing their own profile
    if (!username || !profileId || user?.id === profileId) return;
    
    const registerVisit = () => {
      try {
        // Store visit in local storage for now
        const visits = JSON.parse(localStorage.getItem('profile_visits') || '[]');
        visits.push({
          profile_id: profileId,
          visitor_id: user?.id || null, // null for unauthenticated visitors
          visit_date: new Date().toISOString(),
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
        localStorage.setItem('profile_visits', JSON.stringify(visits));
        
        console.log("Profile visit registered locally:", profileId);
      } catch (error) {
        console.error("Erro ao registrar visita:", error);
      }
    };

    registerVisit();
  }, [username, profileId, user?.id]);

  return null;
};
