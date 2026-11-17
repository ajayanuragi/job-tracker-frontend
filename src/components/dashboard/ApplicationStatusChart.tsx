import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

interface ApplicationStatusChartProps {
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
}

export default function ApplicationStatusChart({
  applied,
  interview,
  offer,
  rejected,
  withdrawn,
}: ApplicationStatusChartProps) {
  const data = [
    { name: "Applied", value: applied, fill: "#475569" },
    { name: "Interview", value: interview, fill: "#8BA3B8" },
    { name: "Offer", value: offer, fill: "#6F9B83" },
    { name: "Rejected", value: rejected, fill: "#B58B8B" },
    { name: "Withdrawn", value: withdrawn, fill: "#D6D3D1" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-75 items-center justify-center text-muted-foreground">
        No application data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart accessibilityLayer={false}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={65}
          outerRadius={100}
        >
          <Label
            value={total.toString()}
            position="center"
            className="fill-foreground text-3xl font-semibold"
          />
        </Pie>
        <Tooltip />
        <Legend
          wrapperStyle={{
            paddingTop: 20,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
