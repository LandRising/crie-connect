
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProfileAnalyticsProps = {
  profileId: string;
};

export const ProfileAnalytics = ({ profileId }: ProfileAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState<string>("today");

  // Mock data for demo purposes
  const mockData = [
    { date: "01/04", count: 4 },
    { date: "02/04", count: 7 },
    { date: "03/04", count: 5 },
    { date: "04/04", count: 8 },
    { date: "05/04", count: 10 },
    { date: "06/04", count: 6 },
    { date: "07/04", count: 9 },
  ];

  const timeframes = {
    today: "Hoje",
    week: "Esta semana",
    month: "Este mês",
    all: "Todo o período"
  };

  const stats = {
    today: { visits: 10, clicks: 6 },
    week: { visits: 49, clicks: 30 },
    month: { visits: 120, clicks: 75 },
    all: { visits: 350, clicks: 210 }
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
                      {stats[timeframe as keyof typeof stats].visits}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Cliques em Links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {stats[timeframe as keyof typeof stats].clicks}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Taxa de Cliques</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {Math.round((stats[timeframe as keyof typeof stats].clicks / stats[timeframe as keyof typeof stats].visits) * 100)}%
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" name="Visitas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
