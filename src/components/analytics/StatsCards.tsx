
import { ArrowUpRight, MousePointerClick, TrendingUp, Users, Link2, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SingleCardProps = {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon: string;
  valueIsText?: boolean;
};

// Continuamos mantendo a interface antiga para compatibilidade com código existente
export type StatsCardsProps = {
  stats: {
    visits: number;
    clicks: number;
  };
  conversionRate: number;
};

// Componente para o card individual
const StatCard = ({ title, value, trend, trendLabel, icon, valueIsText }: SingleCardProps) => {
  // Configurar o ícone dinamicamente baseado na prop icon
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <Users className="w-4 h-4 mr-1 text-purple-500" />;
      case "clicks":
        return <MousePointerClick className="w-4 h-4 mr-1 text-blue-500" />;
      case "rate":
        return <TrendingUp className="w-4 h-4 mr-1 text-green-500" />;
      case "link":
        return <Link2 className="w-4 h-4 mr-1 text-orange-500" />;
      default:
        return <BarChart className="w-4 h-4 mr-1 text-gray-500" />;
    }
  };

  // Definir cor do gradiente baseada no ícone
  const getGradientClass = () => {
    switch (icon) {
      case "users":
        return "from-purple-50 to-white dark:from-purple-950/30 dark:to-black/20";
      case "clicks":
        return "from-blue-50 to-white dark:from-blue-950/30 dark:to-black/20";
      case "rate":
        return "from-green-50 to-white dark:from-green-950/30 dark:to-black/20";
      case "link":
        return "from-orange-50 to-white dark:from-orange-950/30 dark:to-black/20";
      default:
        return "from-gray-50 to-white dark:from-gray-950/30 dark:to-black/20";
    }
  };

  // Definir cor do texto e ícone baseada no tipo
  const getTextColor = () => {
    switch (icon) {
      case "users":
        return "text-purple-700 dark:text-purple-300";
      case "clicks":
        return "text-blue-700 dark:text-blue-300";
      case "rate":
        return "text-green-700 dark:text-green-300";
      case "link":
        return "text-orange-700 dark:text-orange-300";
      default:
        return "text-gray-700 dark:text-gray-300";
    }
  };

  // Definir cor do badge de tendência
  const getTrendBgColor = () => {
    switch (icon) {
      case "users":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300";
      case "clicks":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
      case "rate":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getGradientClass()}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardDescription className="flex items-center">
            {getIcon()}
            {title}
          </CardDescription>
          {trend !== undefined && (
            <span className={`${getTrendBgColor()} text-xs font-medium px-2 py-0.5 rounded-full flex items-center`}>
              +{trend}% <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <p className={`text-3xl font-bold ${getTextColor()}`}>
            {valueIsText ? value : typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {trendLabel && <p className="text-sm text-muted-foreground">{trendLabel}</p>}
        </div>
      </CardContent>
    </Card>
  );
};

// Exportamos tanto o componente individual quanto a versão compatível com a interface antiga
export const StatsCards = (props: SingleCardProps | StatsCardsProps) => {
  // Verificar se estamos usando a nova interface (com title, value, etc)
  if ('title' in props && 'value' in props && 'icon' in props) {
    return <StatCard {...props as SingleCardProps} />;
  }
  
  // Caso contrário, renderizar a versão antiga com os três cards
  const { stats, conversionRate } = props as StatsCardsProps;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Visits"
        value={stats.visits}
        trend={5}
        trendLabel="visitors"
        icon="users"
      />
      <StatCard
        title="Total Clicks"
        value={stats.clicks}
        trend={8}
        trendLabel="clicks"
        icon="clicks"
      />
      <StatCard
        title="Conversion Rate"
        value={`${conversionRate}%`}
        trendLabel="avg. rate"
        icon="rate"
      />
    </div>
  );
};
