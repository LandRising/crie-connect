
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type PerformanceMetricsProps = {
  stats: {
    visits: number;
    clicks: number;
  };
};

export const PerformanceMetrics = ({ stats }: PerformanceMetricsProps) => {
  // Generate mock metrics data
  const metrics = [
    {
      name: "Mobile Traffic",
      value: 68,
      color: "bg-purple-500 dark:bg-purple-400"
    },
    {
      name: "Desktop Traffic",
      value: 24,
      color: "bg-blue-500 dark:bg-blue-400" 
    },
    {
      name: "Tablet Traffic",
      value: 8,
      color: "bg-green-500 dark:bg-green-400"
    }
  ];

  const peakHours = {
    morning: Math.round(15 + Math.random() * 10),
    afternoon: Math.round(25 + Math.random() * 15),
    evening: Math.round(40 + Math.random() * 20),
    night: Math.round(10 + Math.random() * 10),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Device Distribution</CardTitle>
          <CardDescription>Traffic breakdown by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.name}</span>
                  <span className="font-medium">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className={`h-2 ${metric.color}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Peak Activity Hours</CardTitle>
          <CardDescription>When your visitors are most active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Morning (6am-12pm)</span>
                <span className="font-medium">{peakHours.morning}%</span>
              </div>
              <Progress value={peakHours.morning} className="h-2 bg-amber-200 dark:bg-amber-800" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Afternoon (12pm-6pm)</span>
                <span className="font-medium">{peakHours.afternoon}%</span>
              </div>
              <Progress value={peakHours.afternoon} className="h-2 bg-blue-300 dark:bg-blue-700" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Evening (6pm-12am)</span>
                <span className="font-medium">{peakHours.evening}%</span>
              </div>
              <Progress value={peakHours.evening} className="h-2 bg-purple-400 dark:bg-purple-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Night (12am-6am)</span>
                <span className="font-medium">{peakHours.night}%</span>
              </div>
              <Progress value={peakHours.night} className="h-2 bg-indigo-500 dark:bg-indigo-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
