
import { Button } from "@/components/ui/button";

type TimeframeName = "today" | "week" | "month" | "all";

type PeriodSelectorProps = {
  activeTimeframe: TimeframeName;
  onChange: (timeframe: TimeframeName) => void;
};

export const PeriodSelector = ({ activeTimeframe, onChange }: PeriodSelectorProps) => {
  const timeframes = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "all", label: "All Time" },
  ] as const;

  return (
    <div className="flex gap-2">
      {timeframes.map((timeframe) => (
        <Button
          key={timeframe.key}
          variant={activeTimeframe === timeframe.key ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(timeframe.key)}
        >
          {timeframe.label}
        </Button>
      ))}
    </div>
  );
};
