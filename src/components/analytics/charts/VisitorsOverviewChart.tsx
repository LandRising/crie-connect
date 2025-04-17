
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

type DailyVisit = {
  date: string;
  count: number;
};

type VisitorsOverviewChartProps = {
  data: DailyVisit[];
};

export const VisitorsOverviewChart = ({ data }: VisitorsOverviewChartProps) => {
  // Generate clicks data based on visits with a conversion rate between 50-80%
  const chartData = data.map(item => {
    const conversionRate = 0.5 + Math.random() * 0.3; // Random between 0.5-0.8
    return {
      date: item.date,
      visits: item.count,
      clicks: Math.round(item.count * conversionRate)
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="date" 
          tickLine={false}
          tickMargin={10}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <YAxis 
          tickLine={false}
          tickMargin={10}
          axisLine={{ stroke: 'var(--border)' }}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Area 
          type="monotone" 
          dataKey="visits" 
          name="visits"
          stroke="#7C3AED" 
          fill="url(#colorVisits)" 
          strokeWidth={2}
        />
        <Area 
          type="monotone" 
          dataKey="clicks" 
          name="clicks"
          stroke="#3B82F6" 
          fill="url(#colorClicks)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
