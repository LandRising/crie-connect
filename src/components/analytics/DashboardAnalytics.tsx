
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { useAuth } from "@/components/AuthProvider";
import { useProfileStats } from "@/hooks/useProfileStats";
import { VisitorsOverviewChart } from "./charts/VisitorsOverviewChart";
import { LinkPerformanceChart } from "./charts/LinkPerformanceChart";
import { StatsCards } from "./StatsCards";
import { PeriodSelector } from "./PeriodSelector";
import { AnalyticsSkeleton } from "./AnalyticsSkeleton";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { ArrowUpRight, TrendingUp, Users } from "lucide-react";

const DashboardAnalytics = () => {
  const { user } = useAuth();
  const [activeTimeframe, setActiveTimeframe] = useState<"today" | "week" | "month" | "all">("week");
  const { stats, isLoading } = useProfileStats(user?.id || "");
  
  if (isLoading) {
    return <AnalyticsSkeleton />;
  }
  
  const currentStats = stats[activeTimeframe];
  const conversionRate = currentStats.visits > 0 
    ? Math.round((currentStats.clicks / currentStats.visits) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
          <p className="text-muted-foreground">Monitor your page performance and user engagement</p>
        </div>
        <PeriodSelector 
          activeTimeframe={activeTimeframe} 
          onChange={setActiveTimeframe} 
        />
      </div>

      {/* Stats cards */}
      <StatsCards stats={currentStats} conversionRate={conversionRate} />

      {/* Performance metrics */}
      <PerformanceMetrics stats={currentStats} />
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="w-4 h-4 mr-2" />
            Visitor Overview
          </TabsTrigger>
          <TabsTrigger value="links" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="w-4 h-4 mr-2" />
            Link Performance
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="devices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Devices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Visitor Trend</CardTitle>
              <CardDescription>
                Daily visitor count over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ChartContainer 
                  config={{
                    visits: {
                      label: "Visits",
                      theme: {
                        light: "#7C3AED", 
                        dark: "#9F7AEA"
                      }
                    },
                    clicks: {
                      label: "Clicks",
                      theme: {
                        light: "#3B82F6", 
                        dark: "#60A5FA"
                      }
                    }
                  }}
                >
                  <VisitorsOverviewChart data={currentStats.dailyVisits} />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Link Click Distribution</CardTitle>
              <CardDescription>
                Performance breakdown by individual link
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-[350px]">
                <ChartContainer
                  config={{
                    clicks: {
                      label: "Clicks",
                      theme: {
                        light: "#3B82F6", 
                        dark: "#60A5FA"
                      }
                    }
                  }}
                >
                  <LinkPerformanceChart />
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Engagement Metrics</CardTitle>
              <CardDescription>
                User engagement and interaction analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Engagement analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Device Distribution</CardTitle>
              <CardDescription>
                Analytics by device type and browser
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px]">
                <p className="text-muted-foreground">Device analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Growth Insights</CardTitle>
            <CardDescription>Weekly visitor growth analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Growth rate</span>
                <span className="text-green-500 font-medium flex items-center">
                  +12.5% <ArrowUpRight className="ml-1 w-4 h-4" />
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Retention rate</span>
                <span className="text-amber-500 font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Avg. visit duration</span>
                <span className="font-medium">1m 24s</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Top Performing Links</CardTitle>
            <CardDescription>Links with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-medium truncate max-w-[70%]">Instagram</span>
                <span className="text-green-500 font-medium">42 clicks</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b">
                <span className="font-medium truncate max-w-[70%]">YouTube Channel</span>
                <span className="text-green-500 font-medium">36 clicks</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-medium truncate max-w-[70%]">Portfolio Website</span>
                <span className="text-green-500 font-medium">21 clicks</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
