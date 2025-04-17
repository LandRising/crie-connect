
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

export const LinkPerformanceChart = () => {
  // Mock data for link performance
  const data = [
    { name: "Instagram", clicks: 42 },
    { name: "YouTube", clicks: 36 },
    { name: "Portfolio", clicks: 21 },
    { name: "Twitter", clicks: 18 },
    { name: "LinkedIn", clicks: 15 },
    { name: "TikTok", clicks: 12 }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
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
        <Bar 
          dataKey="clicks" 
          name="clicks"
          radius={[4, 4, 0, 0]}
          fill="#3B82F6" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
