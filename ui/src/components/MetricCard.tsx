import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value?: number;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
}

export const MetricCard = ({ title, value, suffix = "", trend = "neutral", description }: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-success" />;
      case "down":
        return <TrendingDown className="w-5 h-5 text-destructive" />;
      default:
        return <Minus className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "from-success/10 to-transparent border-success/20";
      case "down":
        return "from-destructive/10 to-transparent border-destructive/20";
      default:
        return "from-muted/10 to-transparent border-border";
    }
  };

  return (
    <Card className={`p-5 bg-gradient-to-br ${getTrendColor()} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                {value?.toFixed(1) ?? "N/A"}
              </span>
              <span className="text-lg text-muted-foreground">{suffix}</span>
            </div>
          </div>
          <div className="mt-1">
            {getTrendIcon()}
          </div>
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground leading-tight">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};
