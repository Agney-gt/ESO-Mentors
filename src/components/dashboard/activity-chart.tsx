import { useMemo } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityChartProps {
  readonly className?: string;
}

export default function ActivityChart({ className }: Readonly<ActivityChartProps>) {
  // Simulated static chart data
  const activityData = useMemo(() => [
    { key:0,week: "Week 1", matches: 18, height: "75%" },
    { key:1,week: "Week 2", matches: 12, height: "45%" },
    { key:2,week: "Week 3", matches: 24, height: "90%" },
    { key:3,week: "Week 4", matches: 16, height: "60%" },
    { key:4,week: "Week 5", matches: 17, height: "65%" },
  ], []);

  const lastUpdated = useMemo(() => {
    return new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  }, []);

  return (
    <Card className={cn("bg-white rounded-lg shadow", className)}>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-800">Activity Overview</CardTitle>
        <p className="text-sm text-gray-500">Matching activity over the last 30 days</p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="p-5 h-64 flex items-end justify-between space-x-2">
          <div className="flex-1 h-full flex items-end">
            {activityData.map((item) => (
              <div
                key={item.key}
                className="chart-bar bg-primary hover:bg-primary/80 flex-1 mx-1 rounded-t transition-all duration-300"
                style={{ height: item.height }}
                title={`${item.week}: ${item.matches} matches`}
              />
            ))}
          </div>
        </div>

        <div className="p-3 border-t border-gray-200 text-center text-sm text-gray-500">
          Last updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  );
}
