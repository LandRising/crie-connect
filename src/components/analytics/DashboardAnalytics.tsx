
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type VisitData = {
  date: string;
  count: number;
};

const DashboardAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  
  // Generate some sample data for now since we don't have the tables yet
  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    
    // Create mock data for demo purposes
    const mockVisitData: VisitData[] = [];
    const now = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      mockVisitData.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        count: Math.floor(Math.random() * 10) + 1 // Random count between 1-10
      });
    }
    
    setVisitData(mockVisitData);
    setTotalVisits(mockVisitData.reduce((sum, item) => sum + item.count, 0));
    setIsLoading(false);
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Visitas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalVisits}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Cliques</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.floor(totalVisits * 0.6)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">60%</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="visitors">
        <TabsList>
          <TabsTrigger value="visitors">Visitantes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Visitas ao Perfil</CardTitle>
              <CardDescription>Últimos 14 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      name="Visitas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAnalytics;
