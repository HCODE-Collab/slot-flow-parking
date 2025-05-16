
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  helperText?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(helperText || trend) && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {trend && (
              <span
                className={`mr-1 ${
                  trend === "up"
                    ? "text-success"
                    : trend === "down"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
                {trendValue && <span className="ml-0.5">{trendValue}</span>}
              </span>
            )}
            {helperText}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
