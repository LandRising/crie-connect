
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfDay, startOfWeek, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

type TimeframeName = "today" | "week" | "month" | "all";

type DailyVisit = {
  date: string;
  count: number;
};

type TimeframeStats = {
  visits: number;
  clicks: number;
  dailyVisits: DailyVisit[];
};

type ProfileStats = {
  [key in TimeframeName]: TimeframeStats;
};

export const useProfileStats = (profileId: string) => {
  const [stats, setStats] = useState<ProfileStats>({
    today: { visits: 0, clicks: 0, dailyVisits: [] },
    week: { visits: 0, clicks: 0, dailyVisits: [] },
    month: { visits: 0, clicks: 0, dailyVisits: [] },
    all: { visits: 0, clicks: 0, dailyVisits: [] },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!profileId) return;

      setIsLoading(true);
      
      try {
        const today = startOfDay(new Date());
        const weekStart = startOfWeek(new Date());
        const monthStart = startOfMonth(new Date());
        
        // Buscar visitas
        const { data: visitsData, error: visitsError } = await supabase
          .from("profile_visits")
          .select("visit_date")
          .eq("profile_id", profileId);
          
        if (visitsError) throw visitsError;
        
        // Buscar cliques em links
        const { data: clicksData, error: clicksError } = await supabase
          .from("link_clicks")
          .select("click_date")
          .eq("profile_id", profileId);
          
        if (clicksError) throw clicksError;
        
        // Processar estatísticas
        const allVisits = visitsData || [];
        const allClicks = clicksData || [];
        
        // Filtrar por períodos de tempo
        const todayVisits = allVisits.filter(v => new Date(v.visit_date) >= today);
        const weekVisits = allVisits.filter(v => new Date(v.visit_date) >= weekStart);
        const monthVisits = allVisits.filter(v => new Date(v.visit_date) >= monthStart);
        
        const todayClicks = allClicks.filter(c => new Date(c.click_date) >= today);
        const weekClicks = allClicks.filter(c => new Date(c.click_date) >= weekStart);
        const monthClicks = allClicks.filter(c => new Date(c.click_date) >= monthStart);
        
        // Agrupar visitas por dia para gráfico
        const processVisitsByDay = (visits: any[], days: number) => {
          const result: DailyVisit[] = [];
          const now = new Date();
          
          // Criar array com os últimos X dias
          for (let i = days - 1; i >= 0; i--) {
            const date = subDays(now, i);
            const formattedDate = format(date, 'dd/MM', { locale: ptBR });
            
            const count = visits.filter(v => {
              const visitDate = new Date(v.visit_date);
              return visitDate.getDate() === date.getDate() && 
                     visitDate.getMonth() === date.getMonth() &&
                     visitDate.getFullYear() === date.getFullYear();
            }).length;
            
            result.push({ date: formattedDate, count });
          }
          
          return result;
        };
        
        // Calcular estatísticas diárias para diferentes períodos
        const todayStats = { visits: todayVisits.length, clicks: todayClicks.length, dailyVisits: processVisitsByDay(allVisits, 1) };
        const weekStats = { visits: weekVisits.length, clicks: weekClicks.length, dailyVisits: processVisitsByDay(allVisits, 7) };
        const monthStats = { visits: monthVisits.length, clicks: monthClicks.length, dailyVisits: processVisitsByDay(allVisits, 30) };
        const allStats = { visits: allVisits.length, clicks: allClicks.length, dailyVisits: processVisitsByDay(allVisits, 30) };
        
        setStats({
          today: todayStats,
          week: weekStats,
          month: monthStats,
          all: allStats,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [profileId]);

  return { stats, isLoading };
};
