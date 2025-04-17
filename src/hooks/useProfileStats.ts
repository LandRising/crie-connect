
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
          
          // Generate more realistic patterns
          let factor = 1;
          
          // Weekend boost
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            factor *= 1.3; // 30% more traffic on weekends
          }
          
          // Time of month pattern - more at beginning and end
          const dayOfMonth = date.getDate();
          const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
          if (dayOfMonth <= 5 || dayOfMonth >= daysInMonth - 5) {
            factor *= 1.2; // 20% boost at beginning/end of month
          }
          
          // Random daily variation with trending
          const trendFactor = i / days; // Gradually increases as we approach today
          const dailyRandom = 0.7 + (Math.random() * 0.6); // Random between 0.7-1.3
          
          // Combine all factors with base count and trend effect
          const count = Math.max(
            1, 
            Math.floor((baseCount * factor * dailyRandom) * (0.8 + trendFactor * 0.4))
          );
          
          result.push({ date: formattedDate, count });
        }
        
        return result;
      };

      // Generate realistic growth pattern
      const growthFactor = 1.4; // Each timeframe is ~40% larger than previous
      
      const todayVisits = Math.floor(Math.random() * 15) + 10;
      const todayClicks = Math.floor(todayVisits * (0.5 + (Math.random() * 0.3)));
      
      const weekVisits = Math.floor(todayVisits * growthFactor * 7);
      const weekClicks = Math.floor(weekVisits * (0.5 + (Math.random() * 0.3)));
      
      const monthVisits = Math.floor(weekVisits * growthFactor);
      const monthClicks = Math.floor(monthVisits * (0.5 + (Math.random() * 0.3)));
      
      const allVisits = Math.floor(monthVisits * growthFactor);
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

    // Simulate API delay
    setTimeout(generateMockData, 800);
  }, [profileId]);

  return { stats, isLoading };
};
