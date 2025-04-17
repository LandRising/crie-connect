
import { ArrowUpRight, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardsProps = {
  stats: {
    visits: number;
    clicks: number;
  };
  conversionRate: number;
};

export const StatsCards = ({ stats, conversionRate }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-black/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-purple-500" />
              Total Visits
            </CardDescription>
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
              +5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.visits.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">visitors</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-black/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription className="flex items-center">
              <MousePointerClick className="w-4 h-4 mr-1 text-blue-500" />
              Total Clicks
            </CardDescription>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
              +8% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.clicks.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">clicks</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-black/20">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardDescription className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              Conversion Rate
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">{conversionRate}%</p>
            <p className="text-sm text-muted-foreground">avg. rate</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
