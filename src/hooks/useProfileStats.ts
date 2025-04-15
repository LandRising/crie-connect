
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
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
    if (!profileId) return;

    setIsLoading(true);
    
    // Generate mock data for demo purposes
    const generateMockData = () => {
      // Helper to create daily visit data
      const processMockVisitsByDay = (days: number, baseCount: number) => {
        const result: DailyVisit[] = [];
        const now = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(now, i);
          const formattedDate = format(date, 'dd/MM', { locale: ptBR });
          
          // Random count with variation based on the day
          const count = Math.max(1, Math.floor(baseCount + (Math.random() * baseCount / 2) - (baseCount / 4)));
          
          result.push({ date: formattedDate, count });
        }
        
        return result;
      };

      // Generate stats for different time periods
      const todayVisits = Math.floor(Math.random() * 10) + 5;
      const todayClicks = Math.floor(todayVisits * (0.5 + (Math.random() * 0.3)));
      
      const weekVisits = todayVisits + Math.floor(Math.random() * 40) + 20;
      const weekClicks = Math.floor(weekVisits * (0.5 + (Math.random() * 0.3)));
      
      const monthVisits = weekVisits + Math.floor(Math.random() * 100) + 50;
      const monthClicks = Math.floor(monthVisits * (0.5 + (Math.random() * 0.3)));
      
      const allVisits = monthVisits + Math.floor(Math.random() * 200) + 100;
      const allClicks = Math.floor(allVisits * (0.5 + (Math.random() * 0.3)));
      
      setStats({
        today: { 
          visits: todayVisits, 
          clicks: todayClicks, 
          dailyVisits: processMockVisitsByDay(1, todayVisits) 
        },
        week: { 
          visits: weekVisits, 
          clicks: weekClicks, 
          dailyVisits: processMockVisitsByDay(7, weekVisits / 7) 
        },
        month: { 
          visits: monthVisits, 
          clicks: monthClicks, 
          dailyVisits: processMockVisitsByDay(30, monthVisits / 30) 
        },
        all: { 
          visits: allVisits, 
          clicks: allClicks, 
          dailyVisits: processMockVisitsByDay(30, allVisits / 30) 
        },
      });
      
      setIsLoading(false);
    };

    setTimeout(generateMockData, 500); // Simulate API delay
  }, [profileId]);

  return { stats, isLoading };
};
