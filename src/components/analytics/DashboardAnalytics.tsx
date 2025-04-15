
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

type VisitData = {
  date: string;
  count: number;
};

type LinkClickData = {
  title: string;
  clicks: number;
  percentage: number;
};

type DeviceData = {
  type: string;
  count: number;
};

const DashboardAnalytics = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [visitData, setVisitData] = useState<VisitData[]>([]);
  const [linkClickData, setLinkClickData] = useState<LinkClickData[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  
  useEffect(() => {
    if (!user) return;

    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      
      try {
        // Buscar perfil do usuário
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Buscar visitas ao perfil
        const { data: visitsData, error: visitsError } = await supabase
          .from("profile_visits")
          .select("visit_date, user_agent")
          .eq("profile_id", profileData.id);
          
        if (visitsError) throw visitsError;
        
        // Buscar cliques em links
        const { data: clicksData, error: clicksError } = await supabase
          .from("link_clicks")
          .select("link_id, click_date")
          .eq("profile_id", profileData.id);
          
        if (clicksError) throw clicksError;
        
        // Buscar informações dos links
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("id, title")
          .eq("user_id", user.id);
          
        if (linksError) throw linksError;

        // Processar dados de visitas por dia
        const visits = visitsData || [];
        const lastDays = 14; // Últimos 14 dias
        const visitsByDay = processDailyData(visits, lastDays);
        setVisitData(visitsByDay);
        setTotalVisits(visits.length);
        
        // Processar dados de dispositivos
        const userAgents = visits.map(v => v.user_agent || "");
        const devices = processDeviceData(userAgents);
        setDeviceData(devices);
        
        // Processar dados de cliques por link
        const clicks = clicksData || [];
        const links = linksData || [];
        const linkClicks = processLinkClickData(clicks, links);
        setLinkClickData(linkClicks);
        setTotalClicks(clicks.length);
      } catch (error) {
        console.error("Erro ao buscar dados de analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user]);
  
  // Processar dados de visitas diárias
  const processDailyData = (visits: any[], days: number) => {
    const result: VisitData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const formattedDate = format(date, 'dd/MM', { locale: ptBR });
      
      const count = visits.filter(v => {
        const visitDate = new Date(v.visit_date);
        return visitDate.getDate() === date.getDate() && 
               visitDate.getMonth() === date.getMonth() &&
               visitDate.getFullYear() === date.getFullYear();
      }).length;
      
      result.push({ date: formattedDate, count });
    }
    
    return result;
  };
  
  // Processaar dados de dispositivos
  const processDeviceData = (userAgents: string[]) => {
    const devices = {
      desktop: 0,
      mobile: 0,
      tablet: 0,
      other: 0
    };
    
    userAgents.forEach(ua => {
      if (!ua) {
        devices.other++;
        return;
      }
      
      if (/mobile|android|iphone|ipad|ipod/i.test(ua.toLowerCase())) {
        if (/ipad|tablet/i.test(ua.toLowerCase())) {
          devices.tablet++;
        } else {
          devices.mobile++;
        }
      } else {
        devices.desktop++;
      }
    });
    
    return Object.entries(devices).map(([type, count]) => ({ type, count }));
  };
  
  // Processar dados de cliques por link
  const processLinkClickData = (clicks: any[], links: any[]) => {
    const linkCounts: {[key: string]: number} = {};
    
    clicks.forEach(click => {
      linkCounts[click.link_id] = (linkCounts[click.link_id] || 0) + 1;
    });
    
    const total = clicks.length;
    
    return links.map(link => ({
      title: link.title,
      clicks: linkCounts[link.id] || 0,
      percentage: total > 0 ? ((linkCounts[link.id] || 0) / total) * 100 : 0
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5); // Top 5 links
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
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
            <p className="text-3xl font-bold">{totalClicks}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {totalVisits > 0 ? Math.round((totalClicks / totalVisits) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="visitors">
        <TabsList>
          <TabsTrigger value="visitors">Visitantes</TabsTrigger>
          <TabsTrigger value="links">Cliques em Links</TabsTrigger>
          <TabsTrigger value="devices">Dispositivos</TabsTrigger>
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
        
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Links Mais Clicados</CardTitle>
              <CardDescription>Top 5 links com mais cliques</CardDescription>
            </CardHeader>
            <CardContent>
              {linkClickData.length > 0 ? (
                <div className="space-y-4">
                  {linkClickData.map((link, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate">{link.title}</span>
                        <span>{link.clicks} cliques</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${link.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum clique registrado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Dispositivos</CardTitle>
              <CardDescription>Visitantes por tipo de dispositivo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData.filter(d => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="type"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
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
