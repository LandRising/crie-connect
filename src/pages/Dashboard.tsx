
import { useEffect } from "react";
import { useAutoRedirect } from "@/hooks/useAutoRedirect";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";

// Componentes para o dashboard principal
import StatsCards from "@/components/analytics/StatsCards";

const Dashboard = () => {
  // Certificar que o usuário está autenticado
  useAutoRedirect(undefined, "/auth");
  const { profile, profileId } = useProfile();
  
  // Definir o título da página
  useEffect(() => {
    document.title = "Dashboard | CRIEConnect";
  }, []);

  // Buscar estatísticas básicas para exibir no dashboard principal
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats', profileId],
    queryFn: async () => {
      // Normalmente aqui você buscaria dados do backend
      // Retornando dados de exemplo por enquanto
      return {
        totalVisits: 342,
        totalClicks: 127,
        clickRate: 37.1,
        topLink: "Instagram"
      };
    },
    enabled: !!profileId
  });

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      <DashboardHeader 
        title="Dashboard" 
        description={`Bem-vindo, ${profile?.name || '@' + profile?.username || 'usuário'}! Aqui está um resumo da sua página.`}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-6">
            <h2 className="text-xl font-semibold">Visão geral</h2>
            
            {/* Cards de estatísticas */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCards
                  title="Total de visitas"
                  value={stats.totalVisits}
                  trend={12}
                  trendLabel="vs. semana anterior"
                  icon="users"
                />
                <StatsCards
                  title="Total de cliques"
                  value={stats.totalClicks}
                  trend={5}
                  trendLabel="vs. semana anterior"
                  icon="clicks"
                />
                <StatsCards
                  title="Taxa de cliques"
                  value={`${stats.clickRate}%`}
                  trend={2.5}
                  trendLabel="vs. semana anterior"
                  icon="rate"
                />
                <StatsCards
                  title="Link mais popular"
                  value={stats.topLink}
                  icon="link"
                  valueIsText
                />
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <h3 className="text-lg font-medium">Links recentes</h3>
              <a href="/dashboard/links" className="text-primary text-sm hover:underline">Ver todos os links</a>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-lg font-medium">Atividade recente</h3>
              <a href="/dashboard/analytics" className="text-primary text-sm hover:underline">Ver analytics completo</a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
