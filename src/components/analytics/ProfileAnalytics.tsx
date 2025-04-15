
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfileStats } from "@/hooks/useProfileStats";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileAnalyticsProps = {
  profileId: string;
};

export const ProfileAnalytics = ({ profileId }: ProfileAnalyticsProps) => {
  const { stats, isLoading } = useProfileStats(profileId);
  const [activeTab, setActiveTab] = useState<string>("today");

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const timeframes = {
    today: "Hoje",
    week: "Esta semana",
    month: "Este mês",
    all: "Todo o período"
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Analytics</CardTitle>
        <CardDescription>Estatísticas de visualização do seu perfil</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {Object.entries(timeframes).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(timeframes).map((timeframe) => (
            <TabsContent key={timeframe} value={timeframe}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total de Visitas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {stats[timeframe]?.visits || 0}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cliques em Links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {stats[timeframe]?.clicks || 0}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Taxa de Cliques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {stats[timeframe]?.visits 
                        ? Math.round((stats[timeframe]?.clicks / stats[timeframe]?.visits) * 100) 
                        : 0}%
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {stats[timeframe]?.dailyVisits?.length > 0 && (
                <div className="h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats[timeframe].dailyVisits}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" name="Visitas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
